import { useState, useRef, useEffect, useCallback } from "react";

const WS_SIGNALING_URL = import.meta.env.VITE_WS_SIGNALING_URL;
const CHUNK_SIZE = 16 * 1024; // 16 KB

export const useWebRTC = () => {
    const [status, setStatus] = useState("Disconnected");
    const [receivedFile, setReceivedFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [roomCode, setRoomCode] = useState(null);
    const [hasPeer, setHasPeer] = useState(false);

    const ws = useRef(null);
    const isHost = useRef(false);
    const pc = useRef(null);
    const dataChannel = useRef(null);
    const isInitiator = useRef(false);

    // File receiving state
    const incomingMeta = useRef(null);
    const receiveBuffer = useRef([]);
    const receivedSize = useRef(0);
    const iceCandidateQueue = useRef([]);

    const [incomingFileOffer, setIncomingFileOffer] = useState(null);
    const pendingTransfer = useRef(null); // To store file/reader for sender side

    const log = (msg) => {
        setStatus(msg);
        console.log("[WebRTC]", msg);
    };

    const generateRoomCode = () => {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const createRoom = () => {
        const code = generateRoomCode();
        setRoomCode(code);
        joinRoom(code, true);
        return code;
    };

    const setupDataChannel = useCallback((channel) => {
        channel.binaryType = "arraybuffer";

        channel.onopen = () => {
            log("DataChannel open");
            setIsConnected(true);
        };

        channel.onclose = () => {
            log("DataChannel closed");
            setIsConnected(false);
        };

        channel.onerror = (e) => {
            console.error("DataChannel error", e);
        };

        channel.onmessage = (evt) => {
            handleDataMessage(evt.data);
        };
    }, []);

    const handleDataMessage = (message) => {
        if (typeof message === "string") {
            try {
                const obj = JSON.parse(message);

                // 1. Receiver: Handle Incoming Offer
                if (obj.type === "file-offer") {
                    log(`Incoming file offer: ${obj.filename}`);
                    setIncomingFileOffer({ filename: obj.filename, size: obj.size });
                    return;
                }

                // 2. Sender: Handle Acceptance
                if (obj.type === "file-accept") {
                    log("File accepted by peer. Starting transfer...");
                    if (pendingTransfer.current) {
                        pendingTransfer.current.start();
                        pendingTransfer.current = null;
                    }
                    return;
                }

                // 3. Sender: Handle Rejection
                if (obj.type === "file-reject") {
                    log("File rejected by peer.");
                    setStatus("File rejected");
                    pendingTransfer.current = null;
                    return;
                }

                // 4. Receiver: Handle Header (Legacy or Post-Acceptance)
                if (obj && obj.filename && !obj.type) { // Legacy check or simple header
                    incomingMeta.current = obj;
                    receiveBuffer.current = [];
                    receivedSize.current = 0;
                    log(`Receiving "${obj.filename}" (${obj.size} bytes)`);
                    return;
                }

                // 5. Receiver: Handle Completion
                if (obj && obj.done) {
                    // Finalize
                    const blob = new Blob(receiveBuffer.current);
                    const url = URL.createObjectURL(blob);
                    setReceivedFile({
                        name: incomingMeta.current.filename,
                        url: url,
                    });
                    log("File received ready to download");
                    incomingMeta.current = null;
                    receiveBuffer.current = [];
                    receivedSize.current = 0;
                    setProgress(100);
                    setIncomingFileOffer(null); // Clear offer on completion
                    return;
                }

            } catch (e) {
                // Not JSON
            }
        } else if (message instanceof ArrayBuffer) {
            receiveBuffer.current.push(message);
            receivedSize.current += message.byteLength;
            if (incomingMeta.current) {
                const pct = Math.floor(
                    (receivedSize.current / incomingMeta.current.size) * 100
                );
                setProgress(pct);
                log(`Receiving ${receivedSize.current}/${incomingMeta.current.size} (${pct}%)`);
            }
        }
    };

    const acceptFile = () => {
        if (dataChannel.current && dataChannel.current.readyState === "open") {
            dataChannel.current.send(JSON.stringify({ type: "file-accept" }));

            // Re-initialize receiving state just in case
            // The actual header comes after accept, or we create "fake" header from offer?
            // Current flow: Sender sends header immediately after accept.
            // So we just wait.
            log("Accepted file. Waiting for data...");
        }
    };

    const rejectFile = () => {
        if (dataChannel.current && dataChannel.current.readyState === "open") {
            dataChannel.current.send(JSON.stringify({ type: "file-reject" }));
            setIncomingFileOffer(null);
            log("Rejected file.");
        }
    };

    const preparePeer = async (createOffer) => {
        if (pc.current) return;

        pc.current = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        pc.current.onicecandidate = (e) => {
            if (e.candidate && ws.current) {
                ws.current.send(JSON.stringify({ type: "ice", payload: e.candidate }));
            }
        };

        pc.current.ondatachannel = (event) => {
            dataChannel.current = event.channel;
            setupDataChannel(dataChannel.current);
        };

        if (createOffer) {
            log("Creating Data Channel 'file'");
            try {
                dataChannel.current = pc.current.createDataChannel("file", { ordered: true });
                setupDataChannel(dataChannel.current);
            } catch (e) {
                console.error("Failed to create data channel", e);
                return;
            }

            log("Creating Offer...");
            const offer = await pc.current.createOffer();
            log("Setting Local Description (Offer)...");
            await pc.current.setLocalDescription(offer);

            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ type: "offer", payload: offer }));
                log("Offer sent to signaling server");
            } else {
                console.error("WebSocket not open, cannot send offer");
            }
        }
    };

    const joinRoom = (roomId, isCreator = false) => {
        if (!roomId) return;

        isHost.current = isCreator;

        ws.current = new WebSocket(WS_SIGNALING_URL);

        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({ type: "join", room: roomId }));
            log("Connected to signaling, joined room: " + roomId);
        };

        ws.current.onmessage = async (evt) => {
            const msg = JSON.parse(evt.data);
            const { type, payload } = msg;

            if (type === "members") {
                if (payload.count >= 2) {
                    setHasPeer(true);
                }
                // Only the host initiates the offer when a second peer joins
                log(`Members count: ${payload.count}, isHost: ${isHost.current}`);

                if (payload.count === 2 && isHost.current) {
                    log("Initiating offer...");
                    isInitiator.current = true;
                    try {
                        await preparePeer(true);
                    } catch (err) {
                        console.error("Error preparing peer:", err);
                    }
                }
            } else if (type === "offer") {
                if (!pc.current) {
                    await preparePeer(false);
                }

                // Avoid race conditions: if we are already connecting/connected, ignore (or handle glare)
                if (pc.current.signalingState !== "stable") {
                    // For now, simple collision handling: if we are host, ignore. If not, rollback?
                    // But with isHost logic, we shouldn't get here unless multiple offers/reorders.
                    // Just proceed for now but log warning.
                    console.warn("Received offer in non-stable state", pc.current.signalingState);
                    if (isHost.current) return; // Host ignores incoming offers if it started one

                    // If not host, we might need to rollback (advanced), but let's try setting remote
                    await Promise.all([
                        pc.current.setLocalDescription({ type: "rollback" }),
                        pc.current.setRemoteDescription(new RTCSessionDescription(payload))
                    ]);
                } else {
                    await pc.current.setRemoteDescription(new RTCSessionDescription(payload));
                }

                // Flux ICE queue
                while (iceCandidateQueue.current.length > 0) {
                    const candidate = iceCandidateQueue.current.shift();
                    await pc.current.addIceCandidate(candidate);
                }

                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);
                ws.current.send(JSON.stringify({ type: "answer", payload: answer }));
            } else if (type === "answer") {
                if (pc.current && pc.current.signalingState === "have-local-offer") {
                    await pc.current.setRemoteDescription(new RTCSessionDescription(payload));

                    // Flux ICE queue
                    while (iceCandidateQueue.current.length > 0) {
                        const candidate = iceCandidateQueue.current.shift();
                        await pc.current.addIceCandidate(candidate);
                    }
                } else {
                    console.warn("Received answer in unexpected state", pc.current?.signalingState);
                }
            } else if (type === "ice") {
                try {
                    if (pc.current && pc.current.remoteDescription) {
                        await pc.current.addIceCandidate(payload);
                    } else {
                        iceCandidateQueue.current.push(payload);
                    }
                } catch (e) {
                    console.warn("Failed add ICE", e);
                }
            }
        };

        ws.current.onclose = () => log("Signaling disconnected");
    };

    const sendFile = (file) => {
        if (!file || !dataChannel.current || dataChannel.current.readyState !== "open") {
            log("Data channel not open or no file");
            return;
        }

        // 1. Send Offer
        log("Sending file offer...");
        const offerMsg = JSON.stringify({
            type: "file-offer",
            filename: file.name,
            size: file.size
        });
        dataChannel.current.send(offerMsg);

        // 2. Prepare Transfer but wait for Accept
        const startTransfer = () => {
            const header = JSON.stringify({ filename: file.name, size: file.size });
            dataChannel.current.send(header);

            const reader = new FileReader();
            let offset = 0;

            reader.addEventListener("error", (err) => console.error("FileReader error", err));
            reader.addEventListener("load", (e) => {
                dataChannel.current.send(e.target.result);
                offset += e.target.result.byteLength;
                const pct = Math.floor((offset / file.size) * 100);
                setProgress(pct);
                log(`Sent ${offset}/${file.size} (${pct}%)`);

                if (offset < file.size) {
                    readSlice(offset);
                } else {
                    dataChannel.current.send(JSON.stringify({ done: true }));
                    log("File send complete");
                }
            });

            const readSlice = (o) => {
                const slice = file.slice(o, o + CHUNK_SIZE);
                reader.readAsArrayBuffer(slice);
            };

            readSlice(0);
        };

        // Store for later execution
        pendingTransfer.current = { start: startTransfer };
    };

    return {
        joinRoom,
        createRoom,
        sendFile,
        acceptFile,
        rejectFile,
        status,
        receivedFile,
        incomingFileOffer,
        progress,
        isConnected,
        roomCode,
        hasPeer
    };
};
