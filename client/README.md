# SwiftDrop Web - Client

The client-side application for SwiftDrop, built with React 19, Vite, and Material UI. It handles the user interface, WebRTC peer connections, and file processing.

## 📂 Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── core/              # Core configurations (Theme, Contexts)
│   ├── layouts/           # Layout components (MainLayout)
│   ├── modules/           # Feature-based modules
│   │   ├── History/       # Transfer history view
│   │   ├── Home/          # Main transfer interface
│   │   ├── Profile/       # User profile settings
│   │   └── Sidebar/       # Navigation sidebar
│   ├── routes/            # Application routing configuration
│   ├── shared/            # Shared utilities
│   │   ├── components/    # Reusable UI components (Dialogs, Navbar, etc.)
│   │   └── hooks/         # Custom hooks (useWebRTC)
│   ├── styles/            # Global styles (CSS/SCSS)
│   └── main.jsx           # App entry point
├── .env                   # Environment variables
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
└── vite.config.js         # Vite configuration
```

## 🏗️ Implementation Details

### Core Technologies

- **React 19**: Modern component-based UI library.
- **Vite**: Next-generation frontend tooling for fast builds.
- **Material UI (MUI) v7**: Comprehensive UI component library.
- **React Router v7**: Declarative routing for React.

### Key Logic: WebRTC Hook (`useWebRTC.js`)

The heart of the application lives in `src/shared/hooks/useWebRTC.js`. This hook manages:

1.  **Signaling Connection**: Connects to the WebSocket server to exchange session descriptions.
2.  **Peer Connection**: Manages `RTCPeerConnection` configuration and ICE candidates.
3.  **Data Channel**: Creates and monitors the `file` data channel for binary transfer.
4.  **File Chunking**: Reads files in 16KB chunks using `FileReader` and streams them over the channel.
5.  **State Management**: Tracks transfer progress, connection status, and room membership.

### Component Architecture

The application is modularized by feature:

- **Modules**: Each major view (Home, History, Profile) is a self-contained module.
- **Shared Components**: UI elements like `ReceiveDialog`, `SendDialog`, and `ConnectionArea` are reused to maintain consistency.
- **Layouts**: `MainLayout` provides a persistent structure (Sidebar/Navbar) around the dynamic page content.

## 🚀 Development

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Scripts

- `npm run dev`: Start the development server (default port 5173).
- `npm run build`: Build the application for production.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint checks.

### Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_WS_SIGNALING_URL=ws://localhost:3001
```
