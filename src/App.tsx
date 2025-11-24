/**
 * App Component
 *
 * Root application component for RAG News Chatbot.
 */

import React from 'react';
import ChatPage from './pages/ChatPage/ChatPage';
import './App.scss';

function App() {
  return (
    <div className="App">
      <ChatPage />
    </div>
  );
}

export default App;
