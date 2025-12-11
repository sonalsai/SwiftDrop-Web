# SwiftDrop Web - Server

The signaling server for SwiftDrop, built with Node.js and WebSockets. It acts as the intermediary to establish WebRTC connections between peers.

## 📂 Project Structure

```
server/
├── index.js               # Main entry point (HTTP & WebSocket server)
├── package.json           # Dependencies (ws, pino, nodemon)
└── .gitignore             # Git ignore rules
```

## 🏗️ Implementation Details

### Core Technologies

- **Node.js**: Server-side runtime.
- **ws**: Lightweight and fast WebSocket implementation.
- **Pino**: Low-overhead structured logger.

### Signaling Logic (`index.js`)

The server does not relay the actual files. It only relays the **signaling data** required to establish a direct Peer-to-Peer connection.

1.  **Room Management**:

    - Uses a `Map` to track active rooms: `Map<RoomID, Set<WebSocketClient>>`.
    - Handles ephemeral room joining and automatic cleanup when empty.

2.  **Message Protocol**:

    - **`join`**: Client requests to join a specific room.
    - **`members`**: Server broadcasts the current peer count in a room.
    - **`offer`**: Client initiating the connection sends their SDP offer.
    - **`answer`**: Receiving client sends back their SDP answer.
    - **`ice`**: Clients exchange ICE candidates to discover network paths.

3.  **Reliability**:
    - **Ping/Pong**: Basic HTTP endpoint (`/`) acts as a health check or for keep-alive services (e.g., Render free tier).
    - **Error Handling**: Graceful handling of JSON parsing errors and unexpected disconnects.

## 🚀 Development

### Prerequisites

- Node.js (v18+ recommended)

### Scripts

- `npm run dev`: Starts the server with `nodemon` for hot-reloading (default port 3001).
- `npm start`: Starts the production server using `node`.

### Configuration

The server listens on `PORT` environment variable or defaults to `3001`.

```bash
# Example
PORT=4000 npm start
```
