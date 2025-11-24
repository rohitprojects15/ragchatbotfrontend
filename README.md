# RAG News Chatbot - Frontend

> **Assignment**: Full Stack Developer Position at Voosh
> **Project**: RAG-Powered News Chatbot

A modern React + TypeScript chat interface for an AI-powered news chatbot. Features real-time responses, session management, keyboard shortcuts, and responsive design.

## Tech Stack

- **React** 19.2.0 - UI framework
- **TypeScript** 4.9.5 - Type safety
- **SCSS/Sass** 1.94.1 - Styling
- **Axios** 1.13.2 - HTTP client
- **React Markdown** 10.1.0 - Rich text rendering
- **WebSocket** - Real-time streaming (optional)

## Why These Technologies?

**React + TypeScript**: Fast development with type safety, component reusability, great tooling.

**SCSS**: Variables for consistent theming, nested styles for better organization, mixins for responsive breakpoints.

**React Markdown**: Renders bot responses with tables, lists, code blocks - makes AI responses look professional.

**WebSocket**: Real-time streaming for live AI responses (currently using REST API for simplicity).

## Installation

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/rohitprojects15/ragchatbotfrontend.git
   cd ragchatbotfrontend
   npm install
   ```

2. **Set up environment variables**

   Create a `.env` file:
   ```env
   # Use 'mock' for development without backend, 'backend' for real API
   REACT_APP_RAG_MODE=backend

   # Backend URL (when using backend mode)
   REACT_APP_RAG_BACKEND_URL=http://localhost:5000
   REACT_APP_RAG_WS_URL=ws://localhost:5000
   ```

3. **Start the app**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Features

### Chat Interface
- Real-time streaming responses
- Markdown support (tables, lists, code blocks)
- Typing indicator (only when loading, not during streaming)
- Error handling with inline messages
- Message status tracking

### Session Management
- Persistent sessions with localStorage
- History loads on page refresh (24-hour TTL in Redis)
- Reset session button
- Session format: `session_<timestamp>_<random>`

### Keyboard Shortcuts
- `/` - Focus input from anywhere (like YouTube)
- `Enter` - Send message
- `Shift + Enter` - New line

### Responsive Design
Fully responsive from mobile to desktop:
- **Small Mobile** (≤ 480px): Compact layout, hide hints
- **Mobile** (≤ 768px): Smaller avatars and spacing
- **Tablet** (≤ 1024px): Medium sizing
- **Desktop** (1024px - 1600px): Standard layout
- **Large** (≥ 1600px): Enhanced spacing

## Project Structure

```
src/
├── api/
│   ├── RagChatClient.ts         # Axios HTTP client
│   ├── config/
│   │   └── ragEndpoints.ts      # API endpoints
│   └── services/
│       └── RagChatApi.ts        # API methods
├── components/
│   ├── ChatHeader/              # Header with reset button
│   ├── ChatInput/               # Input with auto-resize
│   ├── ChatMessage/             # Message bubbles
│   └── TypingIndicator/         # "..." animation
├── hooks/
│   └── useChat.ts               # Main chat logic
├── interfaces/
│   └── IChat.ts                 # TypeScript interfaces
├── pages/
│   └── ChatPage/                # Main chat page
├── services/
│   ├── SessionManager.ts        # Session ID management
│   └── WebSocketService.ts      # WebSocket handler
└── index.tsx                    # App entry
```

## How It Works

### Session Flow
1. App loads → Check localStorage for session ID
2. If found → Fetch chat history from backend
3. If not found → Create new session
4. User sends message → Save to Redis with 24hr TTL
5. User refreshes → History loads from Redis

### Message Flow (REST API)
1. User types and hits Enter
2. Message sent to `/api/chat/query`
3. Backend runs RAG pipeline (retrieve articles, generate response)
4. Response returned with sources
5. Both messages saved to Redis
6. Chat history persists for 24 hours

### Interface Naming
All TypeScript interfaces use "I" prefix:
```typescript
IChatMessage, ISendMessageRequest, IChatHistoryResponse, etc.
```

## API Modes

### Mock Mode (Development)
```env
REACT_APP_RAG_MODE=mock
```
- Simulates AI responses without backend
- Good for frontend development
- Pre-defined responses with realistic delays

### Backend Mode (Production)
```env
REACT_APP_RAG_MODE=backend
REACT_APP_RAG_BACKEND_URL=http://localhost:5000
```
- Connects to real RAG backend
- Real AI responses from Google Gemini
- Actual news articles as sources

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard:
- `REACT_APP_RAG_MODE=backend`
- `REACT_APP_RAG_BACKEND_URL=https://your-backend.com`

### Netlify
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=build
```

### Other Options
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## Assignment Requirements ✓

### Frontend
- [x] Chat screen showing past messages
- [x] Input box for new messages
- [x] Streaming bot responses (REST API fallback ready)
- [x] Reset session button
- [x] Clean, responsive UI with SCSS
- [x] Mobile-friendly design

### Session Management
- [x] Unique session ID per user
- [x] Session persistence (localStorage + Redis)
- [x] Fetch session history on load
- [x] Clear/reset session functionality

### User Experience
- [x] Typing indicator (shows only when loading)
- [x] Markdown support for rich text
- [x] Error handling
- [x] Keyboard shortcuts
- [x] Loading states

### Code Quality
- [x] TypeScript with consistent "I" interface prefix
- [x] Component-based architecture
- [x] Responsive design patterns
- [x] Clean, maintainable code

## Troubleshooting

**Messages not persisting after refresh?**
- Check backend server is running
- Verify `.env` has correct backend URL
- Check browser console for API errors

**UI not updating with history?**
- Backend must return `messages` array (not `history`)
- Check Redis TTL hasn't expired (24 hours)
- Restart backend after code changes

**Duplicate messages showing?**
- Backend handles deduplication automatically
- Old format messages are cleaned on read

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS 12+, Android 5+)

---

**Assignment for**: Voosh Full Stack Developer Position
**Submitted by**: Rohit Gundeti (rohitrg1522@gmail.com)