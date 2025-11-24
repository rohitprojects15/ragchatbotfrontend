# RAG News Chatbot - Frontend

A modern, responsive React + TypeScript chat interface for a RAG-powered news chatbot. Features real-time streaming responses, session management, and a clean UI built with SCSS.

## Features

- ✨ **Real-time Streaming**: WebSocket-based streaming for live bot responses
- 🎨 **Modern UI**: Clean, responsive design with smooth animations
- 📱 **Mobile-Friendly**: Fully responsive across all device sizes
- 🔄 **Session Management**: Unique session IDs with localStorage persistence
- 💬 **Markdown Support**: Rich text formatting in bot responses
- 🎯 **Reset Session**: Easy chat reset functionality
- 🚀 **Mock Mode**: Built-in mock API for development without backend

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **SCSS** | Styling |
| **Axios** | HTTP client |
| **WebSocket** | Real-time streaming |
| **React Markdown** | Markdown rendering |
| **LocalStorage** | Session persistence |

## Project Structure

```
src/
├── api/
│   ├── RagChatClient.ts          # HTTP client (axios-based)
│   ├── config/
│   │   └── ragEndpoints.ts       # API endpoint definitions
│   └── services/
│       └── RagChatApi.ts         # Chat API methods
│
├── services/
│   ├── WebSocketService.ts       # WebSocket streaming handler
│   └── SessionManager.ts         # Session ID management
│
├── hooks/
│   └── useChat.ts                # Main chat logic hook
│
├── components/
│   ├── ChatMessage/              # Message bubble component
│   ├── ChatInput/                # Text input with send button
│   ├── ChatHeader/               # Header with reset button
│   └── TypingIndicator/          # "Bot is typing..." animation
│
├── pages/
│   └── ChatPage/                 # Main chat page
│
├── types/
│   └── chat.types.ts             # TypeScript interfaces
│
└── App.tsx                       # Root component
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd ragchatbotfrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` to configure your API mode:
   ```env
   # For development (uses mock data)
   REACT_APP_RAG_MODE=mock

   # For production (connects to real backend)
   REACT_APP_RAG_MODE=backend
   REACT_APP_RAG_BACKEND_URL=http://localhost:3001
   REACT_APP_RAG_WS_URL=ws://localhost:3001/chat
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode |
| `npm build` | Builds the app for production |
| `npm test` | Launches the test runner |
| `npm run eject` | Ejects from Create React App (⚠️ irreversible) |

## API Modes

### Mock Mode (Development)

The app includes a built-in mock API that simulates:
- Real-time streaming responses
- Session management
- Realistic delays and typing effects

**Perfect for:**
- Frontend development without backend
- UI/UX testing
- Demo purposes

### Backend Mode (Production)

Connects to your real Node.js/Express backend with:
- RAG pipeline integration
- Google Gemini API
- Redis session storage
- Vector database queries

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_RAG_MODE` | API mode: `mock` or `backend` | `mock` |
| `REACT_APP_RAG_BACKEND_URL` | Backend API base URL | `http://localhost:3001` |
| `REACT_APP_RAG_WS_URL` | WebSocket endpoint URL | `ws://localhost:3001/chat` |

## Key Components

### ChatPage
Main chat interface that orchestrates all components and manages state.

### ChatMessage
Displays individual messages with:
- User/assistant role differentiation
- Markdown rendering for bot responses
- Error state handling
- Streaming animation

### ChatInput
Text input field with:
- Auto-resizing textarea
- Send button with loading state
- Keyboard shortcuts (Enter to send, Shift+Enter for newline)
- Character limit (2000 chars)

### ChatHeader
Header bar featuring:
- App branding
- Reset session button
- Responsive design

### TypingIndicator
Animated "typing..." indicator shown during bot response generation.

## Session Management

Sessions are managed using `SessionManager`:

```typescript
// Get or create session ID
const sessionId = SessionManager.getOrCreateSession();

// Clear session (reset chat)
SessionManager.clearSession();

// Get session info
const info = SessionManager.getSessionInfo();
```

Session data is stored in `localStorage` and persists across page refreshes.

## WebSocket Streaming

Real-time streaming is handled by `WebSocketService`:

```typescript
// Send message
webSocketService.sendMessage(sessionId, message);

// Listen for chunks
webSocketService.onMessage((wsMessage) => {
  if (wsMessage.type === 'chunk') {
    // Handle streaming chunk
  }
});
```

In **mock mode**, streaming is simulated with realistic delays.

## Styling

All styles use **SCSS** with:
- Component-scoped styles
- Responsive breakpoints (768px, 480px)
- CSS animations
- Custom scrollbars
- Accessibility focus states

## Connecting to Backend

When your backend is ready:

1. Update `.env`:
   ```env
   REACT_APP_RAG_MODE=backend
   REACT_APP_RAG_BACKEND_URL=http://your-backend-url
   REACT_APP_RAG_WS_URL=ws://your-backend-url/chat
   ```

2. Ensure your backend provides these endpoints:
   - `POST /api/chat/message` - Send message
   - `GET /api/chat/history/:sessionId` - Get history
   - `DELETE /api/chat/session/:sessionId` - Reset session
   - `WebSocket /chat` - Streaming connection

3. Backend should send WebSocket messages in this format:
   ```json
   {
     "type": "start" | "chunk" | "end" | "error",
     "messageId": "msg_123",
     "content": "response chunk",
     "metadata": {
       "sources": ["Reuters", "BBC"],
       "processingTime": 2.5
     }
   }
   ```

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Recommended Hosting (Free)

| Service | Free Tier | Deployment |
|---------|-----------|------------|
| **Vercel** | Unlimited | `npx vercel` |
| **Netlify** | 100GB/month | Drag & drop `build/` folder |
| **GitHub Pages** | Unlimited | Push to `gh-pages` branch |
| **Cloudflare Pages** | Unlimited | Connect GitHub repo |

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
npm run build
vercel --prod
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

This is an assignment project. Feel free to customize and extend!

## License

MIT

---

**Built for:** Voosh Full Stack Developer Assignment
**Assignment:** RAG-Powered News Chatbot
**Tech Required:** React + SCSS + Node.js + RAG Pipeline
