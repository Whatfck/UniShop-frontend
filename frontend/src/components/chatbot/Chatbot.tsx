import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import './Chatbot.css';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  apiUrl?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ apiUrl = 'http://localhost:8000' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! 👋 **Soy UniBot**, el asistente inteligente de UniShop para estudiantes de la UCC.\n\nPuedo ayudarte con:\n• 🔍 **Buscar libros** y material académico por carrera\n• 🛠️ **Encontrar equipos** de laboratorio y útiles\n• 💼 **Preparación profesional** y empleabilidad\n• 📱 **Navegar** y usar la plataforma UniShop\n\n*¿En qué te puedo ayudar hoy?*',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/v1/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botón flotante */}
      <div className="chatbot-floating-button" onClick={toggleChat}>
        {isOpen ? (
          <span className="close-icon">✕</span>
        ) : (
          <span className="chat-icon">💬</span>
        )}
      </div>

      {/* Modal del chat */}
      {isOpen && (
        <div className="chatbot-modal-overlay" onClick={toggleChat}>
          <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">🤖</div>
                <div>
                  <h3>Asistente UniShop</h3>
                  <span className="chatbot-status">En línea</span>
                </div>
              </div>
              <button className="chatbot-close" onClick={toggleChat}>✕</button>
            </div>

            {/* Mensajes */}
            <div className="chatbot-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.isBot ? 'bot-message' : 'user-message'}`}
                >
                  {message.isBot ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }: any) => <p className="message-text">{children}</p>,
                        strong: ({ children }: any) => <strong className="message-bold">{children}</strong>,
                        ul: ({ children }: any) => <ul className="message-list">{children}</ul>,
                        li: ({ children }: any) => <li className="message-list-item">{children}</li>,
                        h3: ({ children }: any) => <h3 className="message-heading">{children}</h3>,
                        a: ({ children, href }: any) => {
                          // Si es un enlace interno (empieza con /), usar React Router
                          if (href && href.startsWith('/')) {
                            return (
                              <Link to={href} className="message-link" onClick={toggleChat}>
                                {children}
                              </Link>
                            );
                          }
                          // Para enlaces externos, usar <a> normal
                          return (
                            <a href={href} className="message-link" target="_blank" rel="noopener noreferrer">
                              {children}
                            </a>
                          );
                        },
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  ) : (
                    <p className="message-text">{message.text}</p>
                  )}
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="message bot-message loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chatbot-input-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="chatbot-input"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="chatbot-send-button"
              >
                {isLoading ? '⏳' : '📤'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;