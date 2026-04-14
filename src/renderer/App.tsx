import { useState, useEffect, useRef } from 'react';
import { Button } from "@renderer/components/ui/button"
import { Input } from "@renderer/components/ui/input"
import {WELCOME_MESSAGES} from "@renderer/constants";

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

const welcomeMessage = (): string =>
  WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];

const App = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: welcomeMessage(), type: 'agent', id: 0 }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      return parts.map((part, i) => i % 2 === 0 ? <span className="bg-muted" key={i}>{part}</span> : <pre key={i}>{part}</pre>);
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
        <Input
          type="text"
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          autoFocus
          disabled={isLoading}
        />
        <Button  onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} variant="outline"> {isLoading ? '...' : 'Send'}</Button>
      </div>
    </div>
  );
};

export default App;
