# Post-MVP Action Items

## Priority Matrix

### 🔴 Critical (Before Public Launch)

#### 1. Add TURN Server Support

**Impact**: High | **Effort**: Medium (4-6 hours)

**Problem**: 5-10% of users behind symmetric NAT/firewalls cannot connect with STUN only

**Solution**:

```javascript
// In useWebRTC.js, line 168
pc.current = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:your-turn-server.com:3478",
      username: "username",
      credential: "password",
    },
  ],
});
```

**Options**:

- **Self-hosted**: Install coturn on VPS ($5-10/month)
- **Managed**: Twilio, Xirsys, Metered.ca ($0.40/GB)

**Files to modify**: `/client/src/shared/hooks/useWebRTC.js`

---

#### 2. Implement Connection Timeout

**Impact**: Medium | **Effort**: Low (1-2 hours)

**Problem**: Users wait indefinitely if peer never joins

**Solution**:

```javascript
// In useWebRTC.js, add after joining room
const connectionTimeout = setTimeout(() => {
  if (!isConnected) {
    log("Connection timeout - peer did not join");
    setStatus("Connection timeout");
    ws.current?.close();
  }
}, 30000); // 30 seconds

// Clear on successful connection
useEffect(() => {
  if (isConnected) {
    clearTimeout(connectionTimeout);
  }
}, [isConnected]);
```

**Files to modify**: `/client/src/shared/hooks/useWebRTC.js`

---

#### 3. Add File Size Validation

**Impact**: Medium | **Effort**: Low (30 minutes)

**Problem**: Users might attempt to transfer files too large for browser memory

**Solution**:

```javascript
// In sendFile function, line 321
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB

if (file.size > MAX_FILE_SIZE) {
  log(
    `File too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Maximum: 2 GB`
  );
  setStatus("File size exceeds 2 GB limit");
  return;
}
```

**Files to modify**: `/client/src/shared/hooks/useWebRTC.js`

---

### 🟡 High Priority (Within 1 Week)

#### 4. Add Transfer Speed & ETA

**Impact**: Medium | **Effort**: Medium (2-3 hours)

**Implementation**:

```javascript
// Add state
const [transferSpeed, setTransferSpeed] = useState(0);
const [eta, setEta] = useState(null);
const startTime = useRef(null);
const lastUpdate = useRef({ time: 0, size: 0 });

// In chunk receive (line 133)
if (!startTime.current) startTime.current = Date.now();

const now = Date.now();
const timeDiff = (now - lastUpdate.current.time) / 1000;
const sizeDiff = receivedSize.current - lastUpdate.current.size;

if (timeDiff > 0.5) {
  // Update every 500ms
  const speed = sizeDiff / timeDiff; // bytes/sec
  setTransferSpeed(speed);

  const remaining = incomingMeta.current.size - receivedSize.current;
  const etaSeconds = Math.ceil(remaining / speed);
  setEta(etaSeconds);

  lastUpdate.current = { time: now, size: receivedSize.current };
}
```

**UI Updates**:

- SendDialog.jsx: Add speed display (e.g., "1.5 MB/s")
- ReceiveDialog.jsx: Add ETA display (e.g., "30s remaining")

**Files to modify**:

- `/client/src/shared/hooks/useWebRTC.js`
- `/client/src/shared/components/SendDialog/SendDialog.jsx`
- `/client/src/shared/components/ReceiveDialog/ReceiveDialog.jsx`

---

#### 5. Add Transfer Timeout

**Impact**: Medium | **Effort**: Low (1 hour)

**Problem**: Stalled transfers never terminate

**Solution**:

```javascript
// In sendFile, add transfer timeout
let lastProgressTime = Date.now();
const transferTimeout = setInterval(() => {
  if (Date.now() - lastProgressTime > 60000) {
    // 1 minute
    log("Transfer stalled - no progress for 60 seconds");
    setStatus("Transfer failed: Timeout");
    dataChannel.current?.close();
    clearInterval(transferTimeout);
  }
}, 5000); // Check every 5 seconds

// Update on each chunk
reader.addEventListener("load", (e) => {
  lastProgressTime = Date.now();
  // ... rest of code
});
```

**Files to modify**: `/client/src/shared/hooks/useWebRTC.js`

---

#### 6. Improve Error Messages

**Impact**: Low | **Effort**: Low (1-2 hours)

**Current**: Technical messages like "DataChannel closed"
**Improved**: User-friendly messages like "Connection lost. Please try again."

**Solution**: Create error message mapping

```javascript
const ERROR_MESSAGES = {
  "DataChannel closed":
    "Connection lost. The other device may have disconnected.",
  "Signaling disconnected": "Lost connection to server. Check your internet.",
  "File rejected": "The recipient declined your file.",
  "Connection timeout": "Could not connect to recipient. They may have left.",
};

const getUserFriendlyError = (technicalError) => {
  return ERROR_MESSAGES[technicalError] || technicalError;
};
```

**Files to modify**: `/client/src/shared/hooks/useWebRTC.js`

---

### 🟢 Medium Priority (Within 2 Weeks)

#### 7. Add Analytics/Logging

**Impact**: Medium | **Effort**: Low (2-3 hours)

**Purpose**: Track failures, success rate, average transfer times

**Options**:

- Google Analytics 4
- PostHog (open source)
- Sentry (error tracking)

**Events to track**:

- Room created
- Peer joined
- Connection established
- File offer sent
- File accepted/rejected
- Transfer completed
- Transfer failed

---

#### 8. Add Browser Compatibility Check

**Impact**: Low | **Effort**: Low (1 hour)

**Solution**:

```javascript
// In App.jsx or main.jsx
const checkWebRTCSupport = () => {
  if (!window.RTCPeerConnection || !navigator.mediaDevices) {
    return false;
  }
  return true;
};

if (!checkWebRTCSupport()) {
  // Show warning banner
  alert(
    "Your browser doesn't support WebRTC. Please use Chrome, Firefox, Safari, or Edge."
  );
}
```

---

#### 9. Add Room Code Expiration

**Impact**: Medium | **Effort**: Medium (3-4 hours)

**Purpose**: Prevent room code guessing attacks

**Server Implementation**:

```javascript
// In server/index.js
const roomTimestamps = new Map(); // roomId -> createdAt

// On room creation
roomTimestamps.set(room, Date.now());

// Periodic cleanup
setInterval(() => {
  const now = Date.now();
  for (const [room, timestamp] of roomTimestamps) {
    if (now - timestamp > 300000) {
      // 5 minutes
      rooms.delete(room);
      roomTimestamps.delete(room);
    }
  }
}, 60000); // Check every minute
```

---

### 🔵 Low Priority (Future Enhancements)

#### 10. Multi-File Support

**Impact**: Medium | **Effort**: High (8-12 hours)

**Features**:

- Select multiple files
- Queue system
- Sequential transfer
- Overall progress

---

#### 11. Pause/Resume Functionality

**Impact**: Low | **Effort**: High (12-16 hours)

**Complexity**: Requires chunk acknowledgment protocol

---

#### 12. End-to-End Encryption

**Impact**: High (for security-conscious users) | **Effort**: High (10-15 hours)

**Note**: WebRTC already uses DTLS, but this adds client-side encryption before sending

**Options**:

- Web Crypto API (AES-GCM)
- libsodium.js

---

#### 13. Transfer History

**Impact**: Low | **Effort**: Medium (4-6 hours)

**Features**:

- Local storage of transfer metadata
- Recent transfers list
- Click to re-download (if blob still cached)

---

## Implementation Order

### Week 1 (Before Launch)

1. ✅ Day 1-2: Add TURN server
2. ✅ Day 2: Connection timeout
3. ✅ Day 2: File size validation
4. ✅ Day 3-4: Transfer speed & ETA
5. ✅Day 4: Transfer timeout
6. ✅ Day 5: Improve error messages
7. ✅ Day 5: Testing & bug fixes

### Week 2 (Post-Launch improvements)

1. Analytics setup
2. Browser compatibility check
3. Room code expiration
4. Additional testing
5. Documentation updates

### Month 2-3 (Feature Enhancements)

1. Multi-file support
2. Pause/resume
3. End-to-end encryption
4. Transfer history

---

## Testing Checklist

Before deployment, manually test:

### Basic Functionality

- [ ] Room creation generates 6-digit code
- [ ] Guest can join with valid code
- [ ] Invalid code shows error
- [ ] File transfers successfully (various sizes: 1KB, 1MB, 100MB)
- [ ] Progress updates smoothly
- [ ] Download works correctly
- [ ] File is not corrupted (verify checksum)

### Error Scenarios

- [ ] Peer disconnects mid-transfer
- [ ] Sender disconnects mid-transfer
- [ ] Receiver rejects file
- [ ] Network interruption
- [ ] Very slow connection
- [ ] Connection timeout triggers

### Edge Cases

- [Special characters in filename (e.g., `图片.jpg`, `file%20name.txt`)
- [ ] Very small files (< 1 KB)
- [ ] Large files (> 100 MB)
- [ ] Binary files (.exe, .zip, .dmg)
- [ ] Multiple rapid transfers

### Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

---

## Deployment Checklist

### Client Deployment (Vercel/Netlify)

- [ ] Set `VITE_WS_SIGNALING_URL` environment variable
- [ ] Build production bundle (`npm run build`)
- [ ] Test production build locally (`npm run preview`)
- [ ] Deploy to hosting
- [ ] Verify HTTPS is enforced
- [ ] Test live deployment

### Server Deployment (Render/Railway/Heroku)

- [ ] Set `PORT` environment variable
- [ ] Enable WebSocket support
- [ ] Configure CORS headers
- [ ] Set up logging (Pino)
- [ ] Monitor server health
- [ ] Set up auto-restart on crash

### SSL/TLS

- [ ] Ensure server has valid SSL certificate
- [ ] Client must use HTTPS (WebRTC requirement)
- [ ] Test WebSocket over WSS protocol

---

**Last Updated**: December 12, 2025  
**Next Review**: After implementing Week 1 items
