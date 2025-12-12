import { Box, Typography, Button, LinearProgress } from "@mui/material";
import { useState, useEffect } from "react";
import {
  HeroSection,
  FileUploadZone,
  ConnectionArea,
  ConnectionDialog,
  WaitingDialog,
  ReceiveDialog,
  SendDialog,
} from "../../shared/components";
import { useWebRTC } from "../../shared/hooks/useWebRTC";

const Home = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const [isWaitingDialogOpen, setIsWaitingDialogOpen] = useState(false);

  // WebRTC Hook
  const {
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
    hasPeer,
    resetState,
  } = useWebRTC();

  useEffect(() => {
    if (receivedFile) {
      // console.log("File received:", receivedFile);
      // Automatically trigger download or show UI (now handled in ReceiveDialog)
    }
  }, [receivedFile]);

  // Auto-send ONLY if we were waiting for the connection dialog (initial flow)
  useEffect(() => {
    if (isConnected && isWaitingDialogOpen) {
      setIsWaitingDialogOpen(false);
      if (selectedFile) {
        sendFile(selectedFile);
        setSendDialogOpen(true);
      }
    }
  }, [isConnected, isWaitingDialogOpen, selectedFile, sendFile]);

  // Optional: Update UI when peer is detected but not yet fully connected
  useEffect(() => {
    if (hasPeer && isWaitingDialogOpen && !isConnected) {
      // We could potentially update the waiting dialog text here to say "Connecting..."
      // For now, we rely on the dialog's code prop or we can pass a status prop to WaitingDialog
    }
  }, [hasPeer, isWaitingDialogOpen, isConnected]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
    e.target.value = "";
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSendFile = () => {
    if (selectedFile) {
      if (isConnected) {
        // If already connected, send immediately
        sendFile(selectedFile);
        setSendDialogOpen(true);
      } else {
        // If not connected, start room flow
        createRoom();
        setIsWaitingDialogOpen(true);
      }
    }
  };

  const handleOpenConnectionDialog = () => {
    setIsConnectionDialogOpen(true);
  };

  const handleCloseConnectionDialog = () => {
    setIsConnectionDialogOpen(false);
    setIsConnecting(false);
  };

  const handleCloseWaitingDialog = () => {
    setIsWaitingDialogOpen(false);
    // TODO: Ideally leave room here
  };

  const [isConnecting, setIsConnecting] = useState(false);

  // Close connection dialog when connected
  useEffect(() => {
    if (isConnected && isConnectionDialogOpen) {
      setIsConnectionDialogOpen(false);
      setIsConnecting(false);
    }
  }, [isConnected, isConnectionDialogOpen]);

  const handleConnect = (code) => {
    setIsConnecting(true);
    joinRoom(code);
    // setIsConnectionDialogOpen(false); // Don't close immediately
  };

  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [receiveStatus, setReceiveStatus] = useState("request"); // 'request' | 'receiving' | 'completed'
  const [sendDialogOpen, setSendDialogOpen] = useState(false);

  useEffect(() => {
    if (incomingFileOffer) {
      setReceiveDialogOpen(true);
      setReceiveStatus("request");
    }
  }, [incomingFileOffer]);

  // Update status to receiving if accepted
  const handleAcceptFile = () => {
    acceptFile();
    setReceiveStatus("receiving");
  };

  const handleRejectFile = () => {
    rejectFile();
    setReceiveDialogOpen(false);
    setReceiveStatus("request");
  };

  // Update status on completion
  useEffect(() => {
    if (receivedFile) {
      setReceiveStatus("completed");
      setReceiveDialogOpen(true); // Ensure it's open if it wasn't
    }
  }, [receivedFile]);

  // Removed auto-open logic. now controlled by handleSendFile
  // useEffect(() => {
  //     if (selectedFile && isConnected && !incomingFileOffer && !receivedFile) {
  //         setSendDialogOpen(true);
  //     }
  // }, [selectedFile, isConnected, incomingFileOffer, receivedFile]);

  const handleDownloadFile = () => {
    if (receivedFile?.url) {
      const a = document.createElement("a");
      a.href = receivedFile.url;
      a.download = receivedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Optional: Close dialog after download
      // setReceiveDialogOpen(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "400px",
        backgroundColor: "var(--background-color)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HeroSection
        title="Fast File Sharing for Everyone"
        subtitle="A simple way to share your files with anyone, anywhere."
      />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          gap: "24px",
        }}
      >
        <FileUploadZone
          isDragging={isDragging}
          selectedFile={selectedFile}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
          onRemoveFile={handleRemoveFile}
          onSendFile={handleSendFile}
        />

        <ConnectionArea onConnect={handleOpenConnectionDialog} />

        <ConnectionDialog
          open={isConnectionDialogOpen}
          onClose={handleCloseConnectionDialog}
          onConnect={handleConnect}
          loading={isConnecting}
        />

        <WaitingDialog
          open={isWaitingDialogOpen}
          onClose={handleCloseWaitingDialog}
          code={roomCode}
          hasPeer={hasPeer}
        />

        <ReceiveDialog
          open={receiveDialogOpen}
          fileName={
            receivedFile ? receivedFile.name : incomingFileOffer?.filename
          }
          fileSize={incomingFileOffer?.size}
          progress={progress}
          status={receiveStatus}
          onAccept={handleAcceptFile}
          onReject={handleRejectFile}
          onDownload={handleDownloadFile}
          onClose={() => {
            setReceiveDialogOpen(false);
            resetState();
          }}
        />

        <SendDialog
          open={sendDialogOpen}
          fileName={selectedFile?.name}
          progress={progress}
          status={
            status === "File rejected"
              ? "rejected"
              : progress === 100
              ? "completed"
              : progress > 0
              ? "sending"
              : "waiting"
          }
          onClose={() => {
            setSendDialogOpen(false);
            setSelectedFile(null);
            resetState();
          }}
        />
      </Box>
    </Box>
  );
};

export default Home;
