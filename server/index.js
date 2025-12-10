const WebSocket = require("ws");
const pino = require("pino");

const logger = pino({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
        },
    },
});

const server = new WebSocket.Server({ port: 3001 });
const rooms = new Map(); // roomId -> Set(ws)

logger.info("Signaling server starting on port 3001");

server.on("connection", (ws, req) => {
    const ip = req.socket.remoteAddress;
    logger.info({ ip }, "New WebSocket connection established");

    ws.on("message", (raw) => {
        let msg;
        try {
            msg = JSON.parse(raw);
        } catch (e) {
            logger.error({ error: e.message, raw: raw.toString() }, "Failed to parse message");
            return;
        }

        const { type, room, payload } = msg;
        logger.info({ type, room }, "Received message");

        if (type === "join") {
            ws.room = room;
            if (!rooms.has(room)) {
                rooms.set(room, new Set());
                logger.info({ room }, "Created new room");
            }
            rooms.get(room).add(ws);

            const clientCount = rooms.get(room).size;
            logger.info({ room, count: clientCount }, "Client joined room");

            // Notify count
            broadcastToRoom(room, { type: "members", payload: { count: clientCount } });
            return;
        }

        // relay signaling messages
        if (ws.room) {
            logger.info({ type, room: ws.room }, "Broadcasting message to room");
            broadcastToRoom(ws.room, { type, payload }, ws);
        } else {
            logger.warn({ type }, "Received message from client not in a room");
        }
    });

    ws.on("close", () => {
        logger.info("Client disconnected");
        if (ws.room && rooms.has(ws.room)) {
            rooms.get(ws.room).delete(ws);
            const remaining = rooms.get(ws.room).size;

            logger.info({ room: ws.room, remaining }, "Client removed from room");

            if (remaining === 0) {
                rooms.delete(ws.room);
                logger.info({ room: ws.room }, "Room empty, deleted room");
            } else {
                broadcastToRoom(ws.room, {
                    type: "members",
                    payload: { count: remaining },
                });
            }
        }
    });

    ws.on("error", (err) => {
        logger.error({ err }, "WebSocket error occurred");
    });
});

function broadcastToRoom(room, message, exceptWs) {
    if (!rooms.has(room)) {
        logger.warn({ room }, "Attempted to broadcast to non-existent room");
        return;
    }

    const data = JSON.stringify(message);
    let count = 0;

    for (const client of rooms.get(room)) {
        if (client !== exceptWs && client.readyState === WebSocket.OPEN) {
            client.send(data);
            count++;
        }
    }
    logger.info({ room, messageType: message.type, recipients: count }, "Broadcast complete");
}

logger.info("Signaling server is ready and listening on ws://localhost:3001");
