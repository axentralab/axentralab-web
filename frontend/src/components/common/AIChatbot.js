import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import * as uuidLib from 'uuid';
import './AIChatbot.css';

const uuidv4 = uuidLib.v4;

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hi! I'm Axentralab's AI assistant. How can I help you today? I can answer questions about our services, provide pricing info, or help you get started.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(uuidv4());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to UI immediately
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/chatbot/message`,
        {
          message: inputValue,
          sessionId,
        }
      );

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.data.message,
        sender: 'bot',
        timestamp: new Date(),
        chatId: response.data.data.chatId,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: '😕 Sorry, I encountered an issue. Please contact our team at contact@axentralab.com',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const rateLastMessage = (rating) => {
    const lastBotMessage = [...messages].reverse().find(m => m.sender === 'bot' && m.chatId);
    if (!lastBotMessage) return;

    axios.post(
      `${process.env.REACT_APP_API_URL}/chatbot/${lastBotMessage.chatId}/rate`,
      { rating }
    ).catch(console.error);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>🤖 Axentralab AI Assistant</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map(message => (
              <div key={message.id} className={`message message-${message.sender}`}>
                <p className="message-text">{message.text}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}

            {loading && (
              <div className="message message-bot">
                <p className="message-text">
                  <span className="typing-dot">.</span>
                  <span className="typing-dot">.</span>
                  <span className="typing-dot">.</span>
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Rating */}
          {messages.some(m => m.sender === 'bot' && m.chatId) && (
            <div className="chat-rating">
              <small>Was this helpful?</small>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => rateLastMessage(star)}
                    title={`${star} star`}
                  >
                    {'⭐'.repeat(star)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="chat-input-container">
            <textarea
              className="chat-input"
              placeholder="Ask me anything... (Shift+Enter for new line)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              rows="3"
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!inputValue.trim() || loading}
            >
              {loading ? '⏳' : '→'}
            </button>
          </div>

          <div className="chat-suggestions">
            <small>Quick questions:</small>
            <div className="suggestions">
              <button onClick={() => {
                setInputValue('How much does a website cost?');
              }}>💰 Pricing</button>
              <button onClick={() => {
                setInputValue('What services do you offer?');
              }}>🔧 Services</button>
              <button onClick={() => {
                setInputValue('How do I book a consultation?');
              }}>📅 Book Call</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
