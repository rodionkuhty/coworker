import React, { useState, useEffect, useRef } from 'react';

// Define the electronAPI globally as exposed in preload.ts
declare global {
  interface Window {
    electronAPI: {
      sendMessage: (message: string) => Promise<string>;
      onUpdate: (callback: (update: string) => void) => () => void;
    };
  }
}

interface Message {
  text: string;
  type: 'user' | 'agent' | 'update';
  id: number;
}

const App = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Welcome to Coworker! How can I help you with your coding tasks today?', type: 'agent', id: 0 }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Handle updates (tool calls, etc.)
    if (window.electronAPI?.onUpdate) {
      const unsubscribe = window.electronAPI.onUpdate((update) => {
        setMessages(prev => [...prev, { text: update, type: 'update', id: Date.now() + Math.random() }]);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleSendMessage = async () => {
    const messageText = inputValue.trim();
    if (!messageText || isLoading) return;

    setInputValue('');
    setIsLoading(true);
    setMessages(prev => [...prev, { text: messageText, type: 'user', id: Date.now() }]);

    try {
      const response = await window.electronAPI.sendMessage(messageText);
      setMessages(prev => [...prev, { text: response, type: 'agent', id: Date.now() }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { text: `Error: ${error.message}`, type: 'agent', id: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (text: string) => {
    if (text.includes('```')) {
      const parts = text.split('```');
      return parts.map((part, i) => i % 2 === 0 ? <span key={i}>{part}</span> : <pre key={i}>{part}</pre>);
    }
    return text;
  };

  return (
    <div className="app-container">
      <div id="chat-container" ref={chatContainerRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.type}-message`}>
            {formatMessage(msg.text)}
          </div>
        ))}
      </div>
      <div id="input-container">
        <input
          type="text"
          id="user-input"
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          autoFocus
          disabled={isLoading}
        />
        <button id="send-button" onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default App;
