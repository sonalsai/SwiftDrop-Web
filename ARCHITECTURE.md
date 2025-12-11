# SwiftDrop-Web: Complete Architecture & Workflow Documentation

## Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Architecture Diagram](#architecture-diagram)
- [Components Deep Dive](#components-deep-dive)
  - [Root Structure](#root-structure)
  - [Client Application](#client-application)
  - [Server (Signaling Server)](#server-signaling-server)
- [Protocols & APIs](#protocols--apis)
  - [WebRTC](#webrtc)
  - [WebSocket](#websocket)
  - [ICE, STUN, TURN](#ice-stun-turn)
  - [SDP (Session Description Protocol)](#sdp-session-description-protocol)
- [Complete Workflow](#complete-workflow)
  - [Connection Establishment](#connection-establishment)
  - [File Transfer Process](#file-transfer-process)
- [Message Flow & Signaling](#message-flow--signaling)
- [Data Structures](#data-structures)
- [Security & Privacy](#security--privacy)
- [Performance Considerations](#performance-considerations)
- [Error Handling](#error-handling)

---

## System Overview

**SwiftDrop-Web** is a peer-to-peer (P2P) file sharing application that enables direct browser-to-browser file transfers without uploading files to a server. It leverages WebRTC technology for P2P connections and uses a lightweight WebSocket signaling server for connection coordination.

### Key Features

- **Direct P2P File Transfer**: Files transfer directly between browsers
- **No File Storage**: Files never touch the server (privacy-first)
- **Room-Based Connections**: 6-digit room codes for easy pairing
- **Real-time Progress**: Live transfer progress tracking
- **Accept/Reject Flow**: Receiver can accept or reject file offers
- **Cross-Platform**: Works on any modern browser

### High-Level Architecture

```
┌─────────────┐                      ┌─────────────┐
│   Sender    │                      │  Receiver   │
│  (Browser)  │                      │  (Browser)  │
└──────┬──────┘                      └──────┬──────┘
       │                                    │
       │   ┌──────────────────────────┐    │
       ├───┤  WebSocket Signaling     │◄───┤
       │   │  Server (Coordination)   │    │
       │   └──────────────────────────┘    │
       │                                    │
       │  ════════════════════════════════ │
       └──► Direct P2P Data Channel   ◄────┘
            (WebRTC - File Transfer)
```

---

## Technology Stack

### Client Application

```json
{
  "framework": "React 19.2.0",
  "build_tool": "Vite 7.2.4",
  "ui_library": "Material-UI 7.3.6",
  "styling": "@emotion/react + @emotion/styled",
  "routing": "react-router-dom 7.10.1",
  "core_apis": ["WebRTC API", "WebSocket API", "File API", "FileReader API"]
}
```

### Server (Signaling)

```json
{
  "runtime": "Node.js",
  "websocket": "ws 8.18.3",
  "logging": "pino 10.1.0 + pino-pretty 13.1.3",
  "http": "Node.js built-in http module"
}
```

### Protocols

- **WebRTC** (Real-Time Communication)
- **WebSocket** (Signaling Channel)
- **STUN** (NAT Traversal)
- **ICE** (Interactive Connectivity Establishment)
- **SDP** (Session Description Protocol)
- **SCTP** (Stream Control Transmission Protocol - underlying data channel)

---

## Architecture Diagram

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         ROOT PROJECT                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐         ┌─────────────────────────┐  │
│  │                      │         │                         │  │
│  │   CLIENT (Vite App)  │         │   SERVER (Node.js)      │  │
│  │                      │         │                         │  │
│  │  ┌────────────────┐  │         │  ┌──────────────────┐   │  │
│  │  │   src/         │  │         │  │   index.js       │   │  │
│  │  │   ├─ modules/  │  │         │  │   (WebSocket)    │   │  │
│  │  │   ├─ shared/   │  │         │  └──────────────────┘   │  │
│  │  │   ├─ layouts/  │  │         │                         │  │
│  │  │   ├─ routes/   │  │         │  ┌──────────────────┐   │  │
│  │  │   └─ styles/   │  │         │  │   Rooms Map      │   │  │
│  │  └────────────────┘  │         │  │   roomId → Set   │   │  │
│  │                      │         │  └──────────────────┘   │  │
│  └──────────────────────┘         └─────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

External Services:
┌─────────────────────────────────┐
│  STUN: stun.l.google.com:19302  │  (Google STUN Server)
└─────────────────────────────────┘
```

### Client Application Structure

```
client/
├── src/
│   ├── main.jsx                    # Application entry point
│   ├── core/
│   │   └── theme.js                # MUI theme configuration
│   ├── layouts/
│   │   └── MainLayout.jsx          # Main app layout wrapper
│   ├── routes/
│   │   └── Router.jsx              # React Router configuration
│   ├── modules/                    # Feature modules (pages)
│   │   ├── Home/
│   │   │   └── Home.jsx            # Main home page
│   │   ├── Profile/
│   │   ├── History/
│   │   └── Sidebar/
│   ├── shared/                     # Shared utilities & components
│   │   ├── hooks/
│   │   │   └── useWebRTC.js        # ⭐ Core WebRTC logic
│   │   └── components/
│   │       ├── Navbar/
│   │       ├── HeroSection/
│   │       ├── FileUploadZone/     # Drag-drop file upload
│   │       ├── ConnectionArea/     # Room code display/input
│   │       ├── SendDialog/         # Sender progress dialog
│   │       ├── ReceiveDialog/      # Receiver progress dialog
│   │       ├── WaitingDialog/      # Waiting for peer
│   │       └── ConnectionDialog/   # Accept/reject file offer
│   └── styles/
│       └── index.css               # Global styles
├── index.html                      # HTML entry point
├── vite.config.js                  # Vite configuration
└── package.json                    # Dependencies
```

---

## Components Deep Dive

### Root Structure

The root project contains two independent applications:

#### `/client`

- **Type**: Single Page Application (SPA)
- **Purpose**: User interface for file sharing
- **Deployment**: Static hosting (Vercel, Netlify, etc.)
- **Environment**: Browser

#### `/server`

- **Type**: WebSocket signaling server
- **Purpose**: Coordinate peer connections (NOT file transfer)
- **Deployment**: Node.js hosting (Render, Railway, etc.)
- **Environment**: Server-side Node.js

---

### Client Application

#### 1. **Entry Point** (`main.jsx`)

```javascript
// Bootstraps React application
import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./routes/Router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
```

#### 2. **Core WebRTC Hook** (`useWebRTC.js`)

The heart of the application. Manages:

- **WebSocket connection** to signaling server
- **RTCPeerConnection** lifecycle
- **Data channel** creation and management
- **Signaling** (SDP offer/answer exchange)
- **ICE candidate** gathering and exchange
- **File transfer** logic (chunking, progress tracking)

**Key Responsibilities:**

| Function                     | Purpose                                                      |
| ---------------------------- | ------------------------------------------------------------ |
| `createRoom()`               | Generate 6-digit room code and join as host                  |
| `joinRoom(code)`             | Join existing room as guest                                  |
| `preparePeer(createOffer)`   | Initialize RTCPeerConnection and optionally create SDP offer |
| `setupDataChannel(channel)`  | Attach event listeners to data channel                       |
| `sendFile(file)`             | Send file offer and handle chunk-based transfer              |
| `acceptFile()`               | Receiver accepts incoming file offer                         |
| `rejectFile()`               | Receiver rejects incoming file offer                         |
| `handleDataMessage(message)` | Process incoming data channel messages                       |

**State Management:**

```javascript
const [status, setStatus] = useState("Disconnected"); // Connection status
const [receivedFile, setReceivedFile] = useState(null); // Completed file blob
const [progress, setProgress] = useState(0); // Transfer progress (0-100)
const [isConnected, setIsConnected] = useState(false); // Data channel status
const [roomCode, setRoomCode] = useState(null); // Current room code
const [hasPeer, setHasPeer] = useState(false); // Peer connected flag
const [incomingFileOffer, setIncomingFileOffer] = useState(null); // File offer details
```

**Refs (Persistent State):**

```javascript
const ws = useRef(null); // WebSocket connection
const pc = useRef(null); // RTCPeerConnection
const dataChannel = useRef(null); // RTCDataChannel
const isHost = useRef(false); // Is room creator
const isInitiator = useRef(false); // Initiated WebRTC offer
const incomingMeta = useRef(null); // Receiving file metadata
const receiveBuffer = useRef([]); // Chunk buffer for receiving
const receivedSize = useRef(0); // Bytes received so far
const iceCandidateQueue = useRef([]); // Queued ICE candidates
const pendingTransfer = useRef(null); // Pending file transfer callback
```

#### 3. **UI Components**

##### **Home.jsx**

Main page integrating all components:

- Hero section with app description
- File upload zone (drag-drop)
- Connection area (create/join room)
- Dialog orchestration

##### **FileUploadZone.jsx**

Drag-and-drop file selection interface:

- Handles file input
- Validates file selection
- Triggers `sendFile()` when file selected and connected

##### **ConnectionArea.jsx**

Room code management:

- Display room code (host)
- Input field to join room (guest)
- Copy-to-clipboard functionality

##### **ConnectionDialog.jsx**

File offer accept/reject dialog:

- Displays incoming file name and size
- Accept → calls `acceptFile()`
- Reject → calls `rejectFile()`

##### **SendDialog.jsx**

Sender-side transfer progress:

- Shows sending progress
- Displays file name and size
- Real-time percentage updates

##### **ReceiveDialog.jsx**

Receiver-side transfer progress:

- Shows receiving progress
- Download button when complete
- Triggers blob download

---

### Server (Signaling Server)

**File**: `server/index.js`

#### Purpose

The server is a **lightweight signaling server** that:

1. ✅ Manages WebSocket connections
2. ✅ Maintains room memberships
3. ✅ Relays signaling messages (SDP, ICE)
4. ❌ **Does NOT** handle file transfers
5. ❌ **Does NOT** store any file data

#### Architecture

```javascript
const http = require("http");
const WebSocket = require("ws");
const pino = require("pino");

// HTTP Server (for health checks)
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.url === "/") {
    res.end("Signaling Server Running");
  }
});

// WebSocket Server
const wss = new WebSocket.Server({ server });

// Room Management
const rooms = new Map(); // roomId -> Set(WebSocket connections)
```

#### Data Structures

**Rooms Map:**

```javascript
rooms = Map {
  "ABC123" => Set {
    ws1 (host),
    ws2 (guest)
  },
  "XYZ789" => Set {
    ws3 (host)
  }
}
```

**Each WebSocket Connection:**

```javascript
ws.room = "ABC123"; // Attached room ID
```

#### Message Handling

**Incoming Message Types:**

| Message Type | Purpose           | Action                                     |
| ------------ | ----------------- | ------------------------------------------ |
| `join`       | Join a room       | Add client to room, broadcast member count |
| `offer`      | WebRTC SDP offer  | Relay to peer in same room                 |
| `answer`     | WebRTC SDP answer | Relay to peer in same room                 |
| `ice`        | ICE candidate     | Relay to peer in same room                 |

**Outgoing Message Types:**

| Message Type | Purpose               | Payload             |
| ------------ | --------------------- | ------------------- |
| `members`    | Member count update   | `{ count: number }` |
| `offer`      | Relayed SDP offer     | `{ type, sdp }`     |
| `answer`     | Relayed SDP answer    | `{ type, sdp }`     |
| `ice`        | Relayed ICE candidate | `RTCIceCandidate`   |

#### Core Functions

```javascript
// Broadcast message to all clients in a room (except sender)
function broadcastToRoom(room, message, exceptWs) {
  const data = JSON.stringify(message);
  for (const client of rooms.get(room)) {
    if (client !== exceptWs && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}
```

#### Connection Lifecycle

```
Client Connects
      ↓
ws.on("connection")
      ↓
Receive "join" message
      ↓
Add to room Map
      ↓
Broadcast "members" count
      ↓
Relay offer/answer/ice
      ↓
Client Disconnects
      ↓
ws.on("close")
      ↓
Remove from room
      ↓
Delete room if empty
```

---

## Protocols & APIs

### WebRTC

**WebRTC (Web Real-Time Communication)** enables P2P communication in browsers.

#### Core APIs Used

##### 1. **RTCPeerConnection**

The main WebRTC interface representing a connection between peers.

```javascript
pc.current = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});
```

**Configuration:**

- `iceServers`: Array of STUN/TURN servers for NAT traversal

**Key Methods:**

- `createOffer()` - Generate SDP offer
- `createAnswer()` - Generate SDP answer
- `setLocalDescription(sdp)` - Set local SDP
- `setRemoteDescription(sdp)` - Set peer's SDP
- `addIceCandidate(candidate)` - Add ICE candidate
- `createDataChannel(name, options)` - Create data channel (sender only)

**Event Handlers:**

- `onicecandidate` - ICE candidate discovered
- `ondatachannel` - Data channel received (receiver only)
- `onconnectionstatechange` - Connection state changed

**Connection States:**

```
new → connecting → connected → disconnected → closed
                     ↓
                   failed
```

##### 2. **RTCDataChannel**

Bidirectional data channel for arbitrary data (files, messages, etc.)

```javascript
// Sender creates
dataChannel.current = pc.current.createDataChannel("file", {
  ordered: true, // Guarantee in-order delivery
});

// Receiver receives via ondatachannel
pc.current.ondatachannel = (event) => {
  dataChannel.current = event.channel;
};
```

**Options:**

- `ordered: true` - Maintain packet order (essential for files)
- `maxRetransmits: N` - Retry failed packets N times
- `maxPacketLifeTime: ms` - Max time to retry packets

**Properties:**

- `readyState` - "connecting" | "open" | "closing" | "closed"
- `binaryType` - "blob" | "arraybuffer"
- `bufferedAmount` - Bytes queued but not sent

**Methods:**

- `send(data)` - Send string, Blob, ArrayBuffer, or ArrayBufferView
- `close()` - Close the channel

**Event Handlers:**

- `onopen` - Channel ready
- `onmessage` - Data received
- `onclose` - Channel closed
- `onerror` - Error occurred

**Data Types:**

```javascript
channel.send("string message"); // String
channel.send(JSON.stringify({ type: "data" })); // JSON
channel.send(arrayBuffer); // Binary (file chunks)
```

---

### WebSocket

**WebSocket** provides full-duplex communication channel over a single TCP connection.

#### Client-Side Usage

```javascript
ws.current = new WebSocket("wss://signaling.example.com");

ws.current.onopen = () => {
  ws.current.send(JSON.stringify({ type: "join", room: "ABC123" }));
};

ws.current.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // Handle offer, answer, ice, members
};

ws.current.onclose = () => {
  console.log("WebSocket closed");
};

ws.current.onerror = (error) => {
  console.error("WebSocket error:", error);
};
```

#### Server-Side Usage

```javascript
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws, request) => {
  ws.on("message", (data) => {
    const message = JSON.parse(data);
    // Handle and relay messages
  });

  ws.on("close", () => {
    // Clean up room membership
  });
});
```

#### Message Format

All messages are JSON:

```javascript
{
    type: "join" | "offer" | "answer" | "ice" | "members",
    room: "ABC123",        // Optional: room ID
    payload: { ... }       // Optional: message data
}
```

---

### ICE, STUN, TURN

#### ICE (Interactive Connectivity Establishment)

**ICE** is a framework for discovering the best path to connect peers.

**ICE Candidate Types:**

| Type    | Description                           | Example                |
| ------- | ------------------------------------- | ---------------------- |
| `host`  | Local network address                 | `192.168.1.5:54321`    |
| `srflx` | Server reflexive (public IP via STUN) | `203.0.113.45:49152`   |
| `relay` | Relayed via TURN server               | `turn-server.com:3478` |

**ICE Gathering Process:**

```
RTCPeerConnection created
        ↓
setLocalDescription() called
        ↓
ICE gathering starts
        ↓
onicecandidate fires (multiple times)
        ↓
Send each candidate to peer via signaling
        ↓
Peer calls addIceCandidate()
        ↓
ICE negotiation completes
        ↓
onicecandidate fires with null (gathering complete)
```

**Candidate Priority:**

```
host (local) > srflx (STUN) > relay (TURN)
```

#### STUN (Session Traversal Utilities for NAT)

**STUN servers** help discover your public IP address and NAT type.

**How it works:**

```
Browser ──► STUN Server
         └─ "What's my public IP?"

STUN ──► Browser
      └─ "You're 203.0.113.45:49152"
```

**Configuration:**

```javascript
{
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];
}
```

**Free Public STUN Servers:**

- `stun.l.google.com:19302` (Google)
- `stun1.l.google.com:19302` (Google)
- `stun.stunprotocol.org:3478`

#### TURN (Traversal Using Relays around NAT)

**TURN servers** relay traffic when direct P2P fails (symmetric NATs, strict firewalls).

**When needed:**

- ~5-10% of connections require TURN
- Symmetric NAT configurations
- Enterprise firewalls blocking UDP

**Configuration:**

```javascript
{
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:turn-server.example.com:3478",
      username: "user",
      credential: "password",
    },
  ];
}
```

⚠️ **Note**: SwiftDrop currently uses only STUN. TURN would require a paid service or self-hosting.

---

### SDP (Session Description Protocol)

**SDP** describes multimedia communication sessions. In SwiftDrop, it describes the data channel configuration.

#### SDP Offer/Answer Exchange

```
Sender                           Receiver
  ├─ createOffer()
  ├─ setLocalDescription(offer)
  ├─ send offer via WebSocket ──►│
  │                               ├─ setRemoteDescription(offer)
  │                               ├─ createAnswer()
  │                               ├─ setLocalDescription(answer)
  │◄── send answer via WebSocket─┤
  ├─ setRemoteDescription(answer)
  │
  └─ Connection established
```

#### SDP Structure

```javascript
{
    type: "offer" | "answer",
    sdp: "v=0\r\n
          o=- 123456789 2 IN IP4 127.0.0.1\r\n
          s=-\r\n
          t=0 0\r\n
          a=group:BUNDLE 0\r\n
          a=msid-semantic: WMS\r\n
          m=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\n
          ..."
}
```

**Key SDP Lines:**

- `v=0` - Protocol version
- `o=...` - Session origin
- `m=application` - Media type (data channel)
- `a=ice-ufrag` - ICE credentials
- `a=fingerprint` - DTLS certificate fingerprint
- `a=sctp-port` - SCTP port for data channel

---

## Complete Workflow

### Connection Establishment

#### Phase 1: Room Creation/Joining

**Host (Sender) Flow:**

```
1. Click "Create Room"
   └─ generateRoomCode() → "ABC123"
   └─ setRoomCode("ABC123")
   └─ joinRoom("ABC123", isCreator=true)

2. WebSocket connects
   └─ ws.onopen fires
   └─ send { type: "join", room: "ABC123" }

3. Server responds
   └─ { type: "members", payload: { count: 1 } }
   └─ Display "Waiting for peer..."
```

**Guest (Receiver) Flow:**

```
1. Enter room code "ABC123"
   └─ joinRoom("ABC123", isCreator=false)

2. WebSocket connects
   └─ ws.onopen fires
   └─ send { type: "join", room: "ABC123" }

3. Server responds to BOTH clients
   └─ { type: "members", payload: { count: 2 } }
```

#### Phase 2: WebRTC Handshake

```
HOST (Initiator)                           GUEST (Answerer)
      │                                          │
      ├─ Receive members: 2                      ├─ Receive members: 2
      ├─ isHost = true → Initiate                │
      │                                          │
      ├─ preparePeer(createOffer=true)           │
      │   ├─ new RTCPeerConnection()             │
      │   ├─ createDataChannel("file")           │
      │   ├─ createOffer()                       │
      │   ├─ setLocalDescription(offer)          │
      │   └─ onicecandidate starts               │
      │                                          │
      ├─ ws.send({type:"offer", payload:offer})─►│
      │                                          ├─ Receive offer
      │                                          ├─ preparePeer(createOffer=false)
      │                                          │   └─ new RTCPeerConnection()
      │                                          ├─ setRemoteDescription(offer)
      │                                          ├─ createAnswer()
      │                                          ├─ setLocalDescription(answer)
      │                                          └─ onicecandidate starts
      │                                          │
      │◄─ws.send({type:"answer",payload:answer})┤
      │                                          │
      ├─ setRemoteDescription(answer)            │
      │                                          │
      ├─ onicecandidate fires                    │
      │   └─ ws.send({type:"ice",payload:cand})  │
      │        (via signaling server) ──────────►├─ addIceCandidate(cand)
      │                                          │
      │                                          ├─ onicecandidate fires
      │                                          │   └─ ws.send({type:"ice",payload:cand})
      │        (via signaling server) ◄──────────┤
      ├─ addIceCandidate(cand)                   │
      │                                          │
      │                                          ├─ ondatachannel fires
      │                                          ├─ dataChannel received
      │                                          ├─ setupDataChannel()
      │                                          ├─ channel.onopen fires
      │                                          └─ setIsConnected(true)
      │                                          │
      ├─ channel.onopen fires                    │
      ├─ setIsConnected(true)                    │
      │                                          │
      └─ ✅ Data Channel Open ✅ ────────────────┘
```

#### Phase 3: ICE Candidate Exchange

```
As soon as setLocalDescription() is called on each side:

Peer A                          Signaling Server                     Peer B
  │                                    │                                 │
  ├─ onicecandidate ───────────────────┼──► broadcast ──────────────────►│
  │   (host candidate)                 │                                 ├─ addIceCandidate()
  │                                    │                                 │
  ├─ onicecandidate ───────────────────┼──► broadcast ──────────────────►│
  │   (srflx candidate via STUN)       │                                 ├─ addIceCandidate()
  │                                    │                                 │
  │                                    │                                 ├─ onicecandidate
  │                                    │◄────────────────────────────────┤   └─ send({type:"ice"})
  │                                    │   (host candidate)              │
  │◄───────────────────────broadcast───┤                                 │
  ├─ addIceCandidate()                 │                                 │
  │                                    │                                 │
  │                                    │                                 ├─ onicecandidate
  │                                    │◄────────────────────────────────┤   └─ send({type:"ice"})
  │                                    │   (srflx candidate)             │
  │◄───────────────────────broadcast───┤                                 │
  ├─ addIceCandidate()                 │                                 │
  │                                    │                                 │
  ├─ onicecandidate(null) ─────────────┼─────────────────────────────────│
  │   (gathering complete)             │                                 │
  │                                    │                                 │
  │                                    │                                 ├─ onicecandidate(null)
  │                                    │                                 │   (gathering complete)
  │                                    │                                 │
  └─ ICE negotiation completes ────────────────────────────────────────► │
      Connection established!
```

---

### File Transfer Process

#### Phase 1: File Offer (Sender Initiates)

```
SENDER                                                  RECEIVER
  │                                                         │
  ├─ User selects file (via drag-drop or click)            │
  ├─ sendFile(file) called                                 │
  │   └─ Check: dataChannel.readyState === "open" ✓        │
  │                                                         │
  ├─ Send file offer ──────────────────────────────────────►│
  │   dataChannel.send(JSON.stringify({                    ├─ channel.onmessage
  │     type: "file-offer",                                │   └─ Parse JSON
  │     filename: "document.pdf",                          │   └─ incomingFileOffer set
  │     size: 1048576                                      │
  │   }))                                                  ├─ Display ConnectionDialog
  │                                                         │   ┌─────────────────────┐
  ├─ Store pending transfer                                │   │ Accept file?        │
  │   pendingTransfer.current = { start: startTransfer }   │   │ document.pdf (1 MB) │
  │                                                         │   │ [Accept] [Reject]   │
  ├─ Wait for response...                                  │   └─────────────────────┘
  │                                                         │
```

#### Phase 2: Accept/Reject

**If Receiver ACCEPTS:**

```
RECEIVER                                                  SENDER
  │                                                         │
  ├─ User clicks "Accept"                                  │
  ├─ acceptFile() called                                   │
  │                                                         │
  ├─ Send acceptance ──────────────────────────────────────►│
  │   dataChannel.send(JSON.stringify({                    ├─ channel.onmessage
  │     type: "file-accept"                                │   └─ Parse JSON
  │   }))                                                  │   └─ type === "file-accept"
  │                                                         │
  ├─ Reset receive buffers                                 ├─ Execute pendingTransfer.start()
  │   receiveBuffer = []                                   │   └─ Begin file transfer
  │   receivedSize = 0                                     │
  │                                                         │
  ├─ Wait for data...                                      │
```

**If Receiver REJECTS:**

```
RECEIVER                                                  SENDER
  │                                                         │
  ├─ User clicks "Reject"                                  │
  ├─ rejectFile() called                                   │
  │                                                         │
  ├─ Send rejection ───────────────────────────────────────►│
  │   dataChannel.send(JSON.stringify({                    ├─ channel.onmessage
  │     type: "file-reject"                                │   └─ type === "file-reject"
  │   }))                                                  │   └─ Cancel transfer
  │                                                         │   └─ Clear pendingTransfer
  ├─ Clear offer dialog                                    │
  │                                                         ├─ setStatus("File rejected")
  │                                                         │
  └─ Transfer cancelled                                    └─ Transfer cancelled
```

#### Phase 3: File Transfer (After Accept)

```
CHUNK_SIZE = 16 KB (16384 bytes)

SENDER                                                  RECEIVER
  │                                                         │
  ├─ Send file metadata header ────────────────────────────►│
  │   dataChannel.send(JSON.stringify({                    ├─ channel.onmessage (string)
  │     filename: "document.pdf",                          │   └─ incomingMeta.current = metadata
  │     size: 1048576                                      │   └─ setStatus("Receiving...")
  │   }))                                                  │
  │                                                         │
  ├─ Start chunked transfer                                │
  │   ┌─────────────────────────┐                          │
  │   │ file.slice(0, 16384)    │                          │
  │   │ reader.readAsArrayBuffer│                          │
  │   └─────────────────────────┘                          │
  │                                                         │
  ├─ Send chunk 1 (bytes 0-16383) ─────────────────────────►│
  │   dataChannel.send(arrayBuffer)                        ├─ channel.onmessage (ArrayBuffer)
  │                                                         │   └─ receiveBuffer.push(chunk)
  │                                                         │   └─ receivedSize += 16384
  ├─ setProgress(1%)                                       │   └─ setProgress(1%)
  │                                                         │
  ├─ Send chunk 2 (bytes 16384-32767) ─────────────────────►│
  │   dataChannel.send(arrayBuffer)                        ├─ receiveBuffer.push(chunk)
  │                                                         │   └─ setProgress(3%)
  ├─ setProgress(3%)                                       │
  │                                                         │
  ├─ Send chunk 3... ───────────────────────────────────────►│
  ├─ Send chunk 4... ───────────────────────────────────────►│
  │   ...continuing...                                     │   ...receiving...
  ├─ setProgress(50%)                                      │   └─ setProgress(50%)
  │   ...continuing...                                     │   ...receiving...
  ├─ setProgress(99%)                                      │   └─ setProgress(99%)
  │                                                         │
  ├─ Send final chunk (bytes N-1048576) ───────────────────►│
  │                                                         │   └─ receiveBuffer.push(chunk)
  │                                                         │   └─ receivedSize = 1048576
  ├─ Send completion signal ───────────────────────────────►│
  │   dataChannel.send(JSON.stringify({ done: true }))     ├─ channel.onmessage (string)
  │                                                         │   └─ Parse { done: true }
  ├─ setProgress(100%)                                     │   └─ Finalize file
  ├─ setStatus("File sent")                                │       ├─ blob = new Blob(receiveBuffer)
  │                                                         │       ├─ url = URL.createObjectURL(blob)
  │                                                         │       ├─ setReceivedFile({ name, url })
  │                                                         │       ├─ setProgress(100%)
  │                                                         │       └─ setStatus("File received")
  │                                                         │
  └─ ✅ Transfer Complete                                   └─ ✅ Show download button
```

#### Phase 4: File Download (Receiver)

```
RECEIVER (Browser)
  │
  ├─ Click "Download" button
  │   └─ receivedFile.url = "blob:http://..."
  │
  ├─ Create temporary <a> element
  │   const link = document.createElement('a')
  │   link.href = receivedFile.url
  │   link.download = receivedFile.name
  │   link.click()
  │
  ├─ Browser triggers download
  │   └─ File saved to Downloads folder
  │
  └─ Optionally: URL.revokeObjectURL(url)
      └─ Free memory
```

---

## Message Flow & Signaling

### Signaling Messages (via WebSocket)

#### Join Room

```javascript
// Client → Server
{
    type: "join",
    room: "ABC123"
}

// Server → All clients in room
{
    type: "members",
    payload: { count: 2 }
}
```

#### WebRTC Signaling

**Offer (Host → Server → Guest)**

```javascript
{
    type: "offer",
    payload: {
        type: "offer",
        sdp: "v=0\r\no=- 123...\r\n..."
    }
}
```

**Answer (Guest → Server → Host)**

```javascript
{
    type: "answer",
    payload: {
        type: "answer",
        sdp: "v=0\r\no=- 456...\r\n..."
    }
}
```

**ICE Candidate (Both → Server → Other)**

```javascript
{
    type: "ice",
    payload: {
        candidate: "candidate:1 1 UDP 2130706431 192.168.1.5 54321 typ host",
        sdpMid: "0",
        sdpMLineIndex: 0
    }
}
```

### Data Channel Messages (Direct P2P)

#### File Offer

```javascript
{
    type: "file-offer",
    filename: "document.pdf",
    size: 1048576
}
```

#### File Accept/Reject

```javascript
{
  type: "file-accept";
}
{
  type: "file-reject";
}
```

#### File Metadata Header

```javascript
{
    filename: "document.pdf",
    size: 1048576
}
```

#### File Chunk

```javascript
// ArrayBuffer (binary data)
[binary data bytes...]
```

#### Transfer Complete

```javascript
{
  done: true;
}
```

---

## Data Structures

### Client State

```typescript
// WebRTC Hook State
interface WebRTCState {
  status: string; // Current status message
  receivedFile: {
    // Received file ready for download
    name: string;
    url: string; // Blob URL
  } | null;
  progress: number; // 0-100 transfer progress
  isConnected: boolean; // Data channel connected
  roomCode: string | null; // Current room code
  hasPeer: boolean; // Peer joined room
  incomingFileOffer: {
    // Incoming file offer details
    filename: string;
    size: number;
  } | null;
}

// Refs (Persistent)
interface WebRTCRefs {
  ws: WebSocket | null; // Signaling WebSocket
  pc: RTCPeerConnection | null; // Peer connection
  dataChannel: RTCDataChannel | null; // Data channel
  isHost: boolean; // Room creator
  isInitiator: boolean; // WebRTC offer creator
  incomingMeta: {
    // Receiving file metadata
    filename: string;
    size: number;
  } | null;
  receiveBuffer: ArrayBuffer[]; // Chunk buffer
  receivedSize: number; // Bytes received
  iceCandidateQueue: RTCIceCandidate[]; // Queued candidates
  pendingTransfer: {
    // Pending file send
    start: () => void;
  } | null;
}
```

### Server State

```typescript
// Room Management
interface RoomMap {
  [roomId: string]: Set<WebSocket>;
}

// WebSocket Extension
interface ExtendedWebSocket extends WebSocket {
  room?: string; // Attached room ID
}
```

---

## Security & Privacy

### Data Privacy

✅ **Files NEVER touch the server**

- All file data travels directly between browsers via WebRTC data channel
- Server only relays small signaling messages (SDP, ICE)
- End-to-end transfer

✅ **DTLS Encryption**

- All WebRTC connections use DTLS (Datagram Transport Layer Security)
- Encryption is mandatory and automatic
- Keys exchanged via fingerprints in SDP

✅ **No File Storage**

- Sender: File read directly from user's filesystem
- Receiver: File stored as in-memory Blob, then downloaded
- No persistence on either side

### Connection Security

⚠️ **WebSocket Security**

- Currently uses plain WebSocket in dev
- Production: Should use WSS (WebSocket Secure) with TLS
- Signaling messages not encrypted (but contain no file data)

⚠️ **Room Code Security**

- 6-digit alphanumeric codes (36^6 = 2.1 billion combinations)
- No password protection
- Anyone with code can join room
- Mitigation: Codes expire when room closes

⚠️ **STUN Server Privacy**

- STUN servers see your public IP address
- Using Google's STUN (third-party)
- Alternative: Self-host STUN server

### Threat Model

**Protected Against:**

- ✅ Server snooping (files never reach server)
- ✅ Man-in-the-middle (DTLS encryption)
- ✅ Replay attacks (ephemeral connections)

**Vulnerable To:**

- ⚠️ Room code interception (no authentication)
- ⚠️ Malicious file content (no validation)
- ⚠️ Denial of service (no rate limiting)

### Recommendations

1. **Use WSS in production** (`wss://` instead of `ws://`)
2. **Add room passwords** (optional authentication layer)
3. **Implement file type validation** (block executables, scripts)
4. **Add rate limiting** on signaling server
5. **Use self-hosted STUN/TURN** servers
6. **Implement connection timeout** (auto-close stale rooms)

---

## Performance Considerations

### File Transfer Optimization

#### Chunk Size

```javascript
const CHUNK_SIZE = 16 * 1024; // 16 KB
```

**Why 16 KB?**

- WebRTC data channel default max message size: ~256 KB
- Smaller chunks: More overhead, but better progress granularity
- Larger chunks: Less overhead, but risk exceeding limits
- 16 KB: Good balance for most scenarios

**Optimization Options:**

```javascript
// High-throughput, less granular progress
const CHUNK_SIZE = 64 * 1024; // 64 KB

// Lower throughput, very granular progress
const CHUNK_SIZE = 8 * 1024; // 8 KB
```

#### Buffer Management

**Sender-Side Buffering:**

```javascript
// Monitor bufferedAmount to avoid overwhelming channel
if (dataChannel.bufferedAmount > 16 * 1024 * 1024) {
  // 16 MB
  // Pause sending until buffer drains
  setTimeout(() => readNextChunk(), 100);
}
```

**Receiver-Side Buffering:**

```javascript
// receiveBuffer holds all chunks in memory
// For very large files (>1 GB), consider streaming to disk
receiveBuffer.current.push(arrayBuffer);
```

### Connection Performance

#### ICE Candidate Strategy

**Current: All Candidates**

```javascript
// Send every ICE candidate immediately
pc.onicecandidate = (e) => {
  if (e.candidate) {
    ws.send(JSON.stringify({ type: "ice", payload: e.candidate }));
  }
};
```

**Alternative: Trickle ICE**
Already implemented! Candidates sent as discovered.

**Optimization: Gather All First**

```javascript
// Wait for gathering complete, then send all
const candidates = [];
pc.onicecandidate = (e) => {
  if (e.candidate) {
    candidates.push(e.candidate);
  } else {
    // Gathering complete, send all
    ws.send(JSON.stringify({ type: "ice", payload: candidates }));
  }
};
```

#### Connection Timeout

**Add timeout for stale connections:**

```javascript
const CONNECTION_TIMEOUT = 30000; // 30 seconds

const timeout = setTimeout(() => {
  if (pc.connectionState !== "connected") {
    setStatus("Connection timeout");
    cleanup();
  }
}, CONNECTION_TIMEOUT);

pc.onconnectionstatechange = () => {
  if (pc.connectionState === "connected") {
    clearTimeout(timeout);
  }
};
```

### Server Performance

#### Room Cleanup

**Current:**

- Rooms deleted when empty
- Connections closed on disconnect

**Optimization:**

- Add room expiration (e.g., 1 hour)
- Periodic cleanup of stale rooms

```javascript
setInterval(() => {
  const now = Date.now();
  for (const [roomId, room] of rooms.entries()) {
    if (now - room.createdAt > 3600000) {
      // 1 hour
      // Close all connections
      for (const ws of room.clients) {
        ws.close();
      }
      rooms.delete(roomId);
    }
  }
}, 300000); // Check every 5 minutes
```

#### Message Rate Limiting

**Prevent flooding:**

```javascript
const MESSAGE_RATE_LIMIT = 100; // messages per second
const clientRates = new Map();

ws.on("message", (data) => {
  const now = Date.now();
  const rate = clientRates.get(ws) || { count: 0, window: now };

  if (now - rate.window > 1000) {
    rate.count = 0;
    rate.window = now;
  }

  rate.count++;

  if (rate.count > MESSAGE_RATE_LIMIT) {
    ws.close(1008, "Rate limit exceeded");
    return;
  }

  clientRates.set(ws, rate);

  // Process message...
});
```

### Memory Management

#### Blob URL Cleanup

**Important:** Revoke Blob URLs to free memory

```javascript
// After download
URL.revokeObjectURL(receivedFile.url);
setReceivedFile(null);
```

#### Large File Handling

**For files >1 GB, consider:**

1. **Streaming to IndexedDB** (browser storage)
2. **Service Worker** (background processing)
3. **Chunked downloads** (download as you receive)

```javascript
// Example: Stream to IndexedDB
const db = await openIndexedDB();
const transaction = db.transaction("files", "readwrite");
const store = transaction.objectStore("files");

channel.onmessage = (evt) => {
  if (evt.data instanceof ArrayBuffer) {
    store.add({ chunk: evt.data, order: chunkIndex++ });
  }
};
```

---

## Error Handling

### Client-Side Errors

#### WebSocket Errors

```javascript
ws.onerror = (error) => {
  console.error("WebSocket error:", error);
  setStatus("Connection error");
  // Attempt reconnection
  setTimeout(() => reconnect(), 5000);
};

ws.onclose = (event) => {
  if (event.code !== 1000) {
    // Not normal closure
    console.error("WebSocket closed unexpectedly:", event.code, event.reason);
    setStatus("Disconnected");
  }
};
```

**WebSocket Close Codes:**

- `1000` - Normal closure
- `1001` - Going away (page unload)
- `1006` - Abnormal closure (network issue)
- `1008` - Policy violation (rate limit)
- `1009` - Message too large

#### WebRTC Errors

```javascript
pc.onconnectionstatechange = () => {
  switch (pc.connectionState) {
    case "failed":
      setStatus("Connection failed");
      attemptICERestart();
      break;
    case "disconnected":
      setStatus("Connection lost");
      // Wait for reconnection
      break;
    case "closed":
      setStatus("Connection closed");
      cleanup();
      break;
  }
};

const attemptICERestart = async () => {
  const offer = await pc.createOffer({ iceRestart: true });
  await pc.setLocalDescription(offer);
  ws.send(JSON.stringify({ type: "offer", payload: offer }));
};
```

#### File Transfer Errors

```javascript
// FileReader errors
reader.onerror = (error) => {
  console.error("File read error:", error);
  setStatus("Error reading file");
  dataChannel.send(JSON.stringify({ type: "error", message: "Read failed" }));
};

// Data channel errors
dataChannel.onerror = (error) => {
  console.error("Data channel error:", error);
  setStatus("Transfer error");
  cleanup();
};

// Validation errors
if (file.size > 5 * 1024 * 1024 * 1024) {
  // 5 GB limit
  setStatus("File too large (max 5 GB)");
  return;
}

if (!file.type) {
  console.warn("Unknown file type");
  // Optionally block or warn user
}
```

### Server-Side Errors

```javascript
ws.on("error", (error) => {
  logger.error({ error }, "WebSocket error");
});

wss.on("error", (error) => {
  logger.error({ error }, "WebSocket server error");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, closing server");

  // Close all WebSocket connections
  for (const room of rooms.values()) {
    for (const client of room) {
      client.close(1001, "Server shutting down");
    }
  }

  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});
```

### Error Recovery Strategies

**1. Automatic Reconnection**

```javascript
const reconnect = () => {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
    setTimeout(() => joinRoom(roomCode), delay);
  } else {
    setStatus("Unable to reconnect");
  }
};
```

**2. State Recovery**

```javascript
// Save transfer state
const saveState = () => {
  sessionStorage.setItem(
    "transferState",
    JSON.stringify({
      roomCode,
      progress,
      fileName: incomingMeta.current?.filename,
    })
  );
};

// Restore on reconnect
const restoreState = () => {
  const state = JSON.parse(sessionStorage.getItem("transferState"));
  if (state) {
    setRoomCode(state.roomCode);
    // Attempt to resume transfer
  }
};
```

**3. User Notification**

```javascript
// Toast notifications for errors
const showError = (message) => {
  setError(message);
  setTimeout(() => setError(null), 5000);
};

// Examples
showError("Connection lost. Retrying...");
showError("Transfer failed. Please try again.");
showError("Peer disconnected.");
```

---

## Deployment

### Client Deployment

**Recommended Platforms:**

- **Vercel** (current)
- Netlify
- Cloudflare Pages
- GitHub Pages

**Build:**

```bash
cd client
npm run build
# Creates client/dist/ folder
```

**Environment Variables:**

```env
VITE_WS_SIGNALING_URL=wss://your-signaling-server.com
```

### Server Deployment

**Recommended Platforms:**

- **Render** (current)
- Railway
- Fly.io
- Heroku
- Google Cloud Run

**Start:**

```bash
cd server
npm start
# Runs: node index.js
```

**Environment Variables:**

```env
PORT=3001  # Optional, defaults to 3001
```

### Production Checklist

- [ ] Use WSS (WebSocket Secure) for signaling
- [ ] Enable CORS properly on server
- [ ] Add rate limiting
- [ ] Implement connection timeouts
- [ ] Add monitoring/logging (Sentry, LogRocket)
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules (allow WebSocket ports)
- [ ] Test across different networks (3G, 4G, WiFi, VPN)
- [ ] Test behind corporate firewalls
- [ ] Add analytics (connection success rate, transfer speeds)
- [ ] Create error dashboards

---

## Appendix: Message Sequence Diagram

### Complete End-to-End Flow

```
USER A (Host/Sender)          SIGNALING SERVER          USER B (Guest/Receiver)
       │                              │                            │
       ├─ Open browser               │                            ├─ Open browser
       ├─ Load React app              │                            ├─ Load React app
       │                              │                            │
   ┌───┴─────────────────────────────────────────────────────────┴────┐
   │ PHASE 1: ROOM CREATION & JOINING                                 │
   └───┬─────────────────────────────────────────────────────────┬────┘
       │                              │                            │
       ├─ Click "Create Room"         │                            │
       ├─ generateRoomCode()          │                            │
       │  └─ "ABC123"                 │                            │
       ├─ new WebSocket(URL) ─────────►                            │
       ├─ ws.onopen                   │                            │
       ├─ send({type:"join",          │                            │
       │        room:"ABC123"}) ───────►                            │
       │                              ├─ rooms.set("ABC123")       │
       │                              ├─ broadcast({type:"members",│
       │◄─────────────────────────────┤           payload:{count:1}}
       │                              │                            │
       ├─ Display "Room: ABC123"      │                            ├─ User enters "ABC123"
       ├─ Display "Waiting..."        │                            ├─ Click "Join"
       │                              │                            ├─ new WebSocket(URL) ───►
       │                              │                            ├─ ws.onopen
       │                              │                            ├─ send({type:"join",
       │                              │◄───────────────────────────┤      room:"ABC123"})
       │                              ├─ rooms.get("ABC123").add(ws2)
       │                              ├─ broadcast({type:"members",
       │◄─────────────────────────────┤           payload:{count:2}}
       │                              ├───────────────────────────►│
       │                              │                            │
   ┌───┴─────────────────────────────────────────────────────────┴────┐
   │ PHASE 2: WEBRTC HANDSHAKE                                        │
   └───┬─────────────────────────────────────────────────────────┬────┘
       │                              │                            │
       ├─ Detect count=2 && isHost    │                            ├─ Detect count=2
       ├─ preparePeer(true)           │                            │
       │  ├─ new RTCPeerConnection()  │                            │
       │  ├─ createDataChannel("file")│                            │
       │  ├─ createOffer()            │                            │
       │  └─ setLocalDescription()    │                            │
       │     └─ ICE gathering starts  │                            │
       │                              │                            │
       ├─ send({type:"offer",         │                            │
       │        payload:sdp}) ─────────►                            │
       │                              ├─ broadcast ────────────────►│
       │                              │                            ├─ preparePeer(false)
       │                              │                            │  └─ new RTCPeerConnection()
       │                              │                            ├─ setRemoteDescription(offer)
       │                              │                            ├─ createAnswer()
       │                              │                            ├─ setLocalDescription()
       │                              │                            │  └─ ICE gathering starts
       │                              │                            │
       │                              │                            ├─ send({type:"answer",
       │                              │◄───────────────────────────┤      payload:sdp})
       │                              ├─ broadcast ───────────────►│
       │◄─────────────────────────────┤                            │
       ├─ setRemoteDescription(answer)│                            │
       │                              │                            │
   ┌───┴─────────────────────────────────────────────────────────┴────┐
   │ PHASE 3: ICE CANDIDATE EXCHANGE                                  │
   └───┬─────────────────────────────────────────────────────────┬────┘
       │                              │                            │
       ├─ onicecandidate ─────────────►                            │
       │  └─ send({type:"ice",...})   ├─ broadcast ────────────────►│
       │                              │                            ├─ addIceCandidate()
       │                              │                            │
       │                              │                            ├─ onicecandidate ──────►
       │                              │◄───────────────────────────┤  └─ send({type:"ice"})
       │                              ├─ broadcast ───────────────►│
       │◄─────────────────────────────┤                            │
       ├─ addIceCandidate()           │                            │
       │                              │                            │
       ├─ (repeat multiple times)     │                            ├─ (repeat multiple times)
       │                              │                            │
       │                              │                            ├─ ondatachannel fires
       │                              │                            ├─ channel.onopen
       ├─ channel.onopen              │                            ├─ setIsConnected(true)
       ├─ setIsConnected(true)        │                            │
       │                              │                            │
       ├─ ✅ Data Channel Open        │                            ├─ ✅ Data Channel Open
       │                              │                            │
   ┌───┴─────────────────────────────────────────────────────────┴────┐
   │ PHASE 4: FILE OFFER & ACCEPTANCE                                 │
   └───┬─────────────────────────────────────────────────────────┬────┘
       │                              │                            │
       ├─ User selects file           │                            │
       ├─ sendFile(file)              │                            │
       │                              │                            │
       ├─ channel.send({type:"file-offer",                         │
       │                filename:"doc.pdf",                        │
       │                size:1048576}) ═══════════════════════════►│
       │                              │                            ├─ channel.onmessage
       │                              │                            ├─ setIncomingFileOffer()
       │                              │                            ├─ Show dialog:
       │                              │                            │  "Accept doc.pdf (1 MB)?"
       │                              │                            │
       ├─ Wait for response...        │                            ├─ User clicks "Accept"
       │                              │                            ├─ acceptFile()
       │                              │                            │
       │        ◄═══════════════════════════════════════════════════┤ channel.send({
       │                              │                            │    type:"file-accept"})
       ├─ channel.onmessage           │                            │
       ├─ Execute pendingTransfer     │                            │
       │                              │                            │
   ┌───┴─────────────────────────────────────────────────────────┴────┐
   │ PHASE 5: FILE TRANSFER (P2P - NO SERVER INVOLVEMENT)           │
   └───┬─────────────────────────────────────────────────────────┬────┘
       │                              │                            │
       ├─ Send metadata ═══════════════════════════════════════════►│
       │  {filename,size}             │                            ├─ incomingMeta.current set
       │                              │                            │
       ├─ Send chunk 1 ════════════════════════════════════════════►│
       │  (ArrayBuffer 16KB)          │                            ├─ receiveBuffer.push()
       ├─ setProgress(1%)             │                            ├─ setProgress(1%)
       │                              │                            │
       ├─ Send chunk 2 ════════════════════════════════════════════►│
       ├─ setProgress(3%)             │                            ├─ setProgress(3%)
       │                              │                            │
       ├─ ... (continuing) ...        │                            ├─ ... (receiving) ...
       │                              │                            │
       ├─ Send final chunk ═══════════════════════════════════════►│
       ├─ setProgress(99%)            │                            ├─ setProgress(99%)
       │                              │                            │
       ├─ Send {done:true} ═══════════════════════════════════════►│
       │                              │                            ├─ new Blob(receiveBuffer)
       │                              │                            ├─ URL.createObjectURL()
       ├─ setProgress(100%)           │                            ├─ setReceivedFile()
       ├─ setStatus("Complete")       │                            ├─ setProgress(100%)
       │                              │                            ├─ Show "Download" button
       │                              │                            │
       │                              │                            ├─ User clicks "Download"
       │                              │                            ├─ File saved to disk
       │                              │                            │
       └─ ✅ Transfer Complete        │                            └─ ✅ File Downloaded
```

---

## Glossary

| Term                | Definition                                                            |
| ------------------- | --------------------------------------------------------------------- |
| **WebRTC**          | Web Real-Time Communication - Browser API for P2P connections         |
| **STUN**            | Session Traversal Utilities for NAT - Discovers public IP addresses   |
| **TURN**            | Traversal Using Relays around NAT - Relays traffic when P2P fails     |
| **ICE**             | Interactive Connectivity Establishment - Framework for peer discovery |
| **SDP**             | Session Description Protocol - Describes connection parameters        |
| **Data Channel**    | WebRTC feature for arbitrary data transfer (not just media)           |
| **Signaling**       | Process of exchanging SDP and ICE candidates before P2P connection    |
| **NAT**             | Network Address Translation - Router feature that hides local IPs     |
| **Peer Connection** | Direct connection between two browsers                                |
| **Chunk**           | Small piece of a file sent individually                               |
| **Blob**            | Binary Large Object - In-memory file representation                   |
| **ArrayBuffer**     | Raw binary data buffer                                                |

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-11  
**Project**: SwiftDrop-Web  
**Repository**: https://github.com/sonalsai/SwiftDrop-Web
