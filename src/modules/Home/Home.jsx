import { Box } from "@mui/material";
import { useState } from "react";
import {
  Navbar,
  HeroSection,
  FileUploadZone,
  ConnectionArea,
} from "../../shared/components";

const Home = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
    console.log("Sending file:", selectedFile);
  };

  const handleConnect = () => {
    console.log("Connecting to receiver...");
    // TODO: Implement connection logic
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--background-color)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <HeroSection
        title="Instant Peer-to-Peer Sharing"
        subtitle="Share files instantly via secure P2P connection. No uploads, no limits, just pure speed."
      />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "0 32px 64px",
          maxWidth: "1440px",
          margin: "0 auto",
          width: "100%",
          gap: "32px",
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

        <ConnectionArea onConnect={handleConnect} />
      </Box>
    </Box>
  );
};

export default Home;
