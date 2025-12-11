# SwiftDrop Web

**SwiftDrop** is a modern, web-based file sharing application designed for high-speed, secure, and direct peer-to-peer file transfers. By leveraging WebRTC for data streaming and specific WebSocket signaling for connection establishment, SwiftDrop eliminates the need for third-party cloud storage for ephemeral sharing.

## 🚀 Features

- **Peer-to-Peer Transfer**: Direct browser-to-browser file sharing using WebRTC.
- **Real-time Connection**: Instant signaling via a custom WebSocket server.
- **Room-Based Sharing**: Create or join unique rooms to connect with peers securely.
- **Modern UI/UX**: Built with Material UI v7 and React 19 for a sleek, responsive experience.
- **Cross-Device**: Accessible from any modern web browser.

## 🛠️ Tech Stack

**Client**

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router v7
- **Styling**: Material UI (MUI) v7, Emotion
- **Real-time Protocol**: WebRTC

**Server**

- **Runtime**: Node.js
- **WebSockets**: `ws` library
- **Logging**: Pino & Pino-pretty

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/sonalsai/SwiftDrop-Web.git
cd SwiftDrop-Web
```

### Server Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

### Client Setup

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

## 🚀 Running the Project

You will need to run both the signaling server and the client application.

### 1. Start Signaling Server

```bash
cd server
npm run dev
```

_Runs on port 3001 by default._

### 2. Start Client Application

Open a new terminal:

```bash
cd client
npm run dev
```

_The application will launch in your browser (usually at http://localhost:5173)._

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the MIT License.
