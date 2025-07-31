import React, { useState, useRef, useEffect } from 'react';
import { useClaudeChat, UserData } from '../hooks/useClaudeChat';

const CleanChatInterface: React.FC = () => {
  const { messages, isLoading, error, sendMessage, clearMessages, clearError } = useClaudeChat();
  const [input, setInput] = useState('');
  const [showUserDataForm, setShowUserDataForm] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageToSend = input;
    setInput('');
    await sendMessage(messageToSend, userData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleUserDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowUserDataForm(false);
  };

  const quickPrompts = [
    "Market my SaaS product",
    "Social media strategy", 
    "Content marketing plan",
    "Platform selection help",
    "More"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Simple Header */}
      <header>
        <div className="header-container">
          <div className="header-left">
            <h1 className="logo">LaunchAI</h1>
            <nav className="nav">
              <a href="#" className="nav-link">Research</a>
              <a href="#" className="nav-link">Strategy</a>
              <a href="#" className="nav-link">For Business</a>
              <a href="#" className="nav-link">Campaigns</a>
              <a href="#" className="nav-link">Analytics</a>
            </nav>
          </div>
          
          <div className="header-right">
            <button
              onClick={() => setShowUserDataForm(!showUserDataForm)}
              className="profile-link"
              style={{ marginRight: '1rem' }}
            >
              {showUserDataForm ? '✓ Business Info' : '👤 Business Info'}
            </button>
            <button
              onClick={clearMessages}
              className="profile-link"
              style={{ color: '#dc2626' }}
            >
              Clear Chat
            </button>
            <div className="user-info">
              <span>👤</span>
              <span>MVP Tester</span>
            </div>
          </div>
        </div>
      </header>

      {/* Business Info Form (when expanded) */}
      {showUserDataForm && (
        <div style={{ 
          backgroundColor: '#f9fafb', 
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 0'
        }}>
          <div className="main-container">
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              color: '#111827',
              marginBottom: '1rem' 
            }}>
              Tell us about your business for personalized strategies
            </h3>
            <form onSubmit={handleUserDataSubmit} style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  marginBottom: '0.25rem' 
                }}>
                  Business Type
                </label>
                <input
                  type="text"
                  value={userData.businessType || ''}
                  onChange={(e) => setUserData(prev => ({ ...prev, businessType: e.target.value }))}
                  placeholder="e.g., SaaS, E-commerce"
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  marginBottom: '0.25rem' 
                }}>
                  Target Audience
                </label>
                <input
                  type="text"
                  value={userData.targetAudience || ''}
                  onChange={(e) => setUserData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="e.g., Small businesses"
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  marginBottom: '0.25rem' 
                }}>
                  Marketing Goals
                </label>
                <input
                  type="text"
                  value={userData.goals || ''}
                  onChange={(e) => setUserData(prev => ({ ...prev, goals: e.target.value }))}
                  placeholder="e.g., Lead generation"
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  color: '#374151',
                  marginBottom: '0.25rem' 
                }}>
                  Monthly Budget
                </label>
                <input
                  type="text"
                  value={userData.budget || ''}
                  onChange={(e) => setUserData(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="e.g., $5,000/month"
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="main-container">
        <div className="content-wrapper">
          {messages.length === 0 ? (
            // Initial Homepage - Clean Design
            <div className="homepage">
              <h1 className="main-title">Create your marketing strategy with AI</h1>
              
              <div className="input-section">
                <div className="input-container">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Help me market my new SaaS product on social media"
                    className="main-textarea"
                    rows={3}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isLoading}
                    className="send-button"
                  >
                    <span>↑</span>
                  </button>
                </div>
                
                <div className="profile-prompt">
                  💡 Get personalized marketing recommendations with AI {' '}
                  <span style={{ color: '#10b981', fontSize: '0.75rem' }}>
                    • Powered by Claude & GPT-4o
                  </span>
                </div>
              </div>

              <div className="suggestions">
                {quickPrompts.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(suggestion)}
                    className="suggestion-btn"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="info-banner">
                <div className="banner-content">
                  <div className="banner-left">
                    <div className="status-dot"></div>
                    <span className="banner-title">AI-Powered</span>
                    <span className="banner-text">
                      Real marketing strategies from Claude & OpenAI
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Chat Messages - Clean Design
            <div>
              <div style={{ marginBottom: '2rem' }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{ 
                      display: 'flex', 
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <div style={{
                      maxWidth: '42rem',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      backgroundColor: message.role === 'user' ? '#111827' : '#f9fafb',
                      color: message.role === 'user' ? 'white' : '#111827',
                      border: message.role === 'assistant' ? '1px solid #d1d5db' : 'none'
                    }}>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.5'
                      }}>
                        {message.content}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        marginTop: '0.5rem',
                        color: message.role === 'user' ? '#d1d5db' : '#6b7280',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        {message.role === 'assistant' && message.provider && (
                          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>
                            {message.provider === 'claude' ? '🎯 Claude' : '🤖 GPT-4o'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      padding: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <div style={{
                            width: '0.5rem',
                            height: '0.5rem',
                            backgroundColor: '#9ca3af',
                            borderRadius: '50%',
                            animation: 'bounce 1.4s infinite ease-in-out both'
                          }}></div>
                          <div style={{
                            width: '0.5rem',
                            height: '0.5rem',
                            backgroundColor: '#9ca3af',
                            borderRadius: '50%',
                            animation: 'bounce 1.4s infinite ease-in-out both',
                            animationDelay: '-0.16s'
                          }}></div>
                          <div style={{
                            width: '0.5rem',
                            height: '0.5rem',
                            backgroundColor: '#9ca3af',
                            borderRadius: '50%',
                            animation: 'bounce 1.4s infinite ease-in-out both',
                            animationDelay: '-0.32s'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          AI is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h3 style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: 600 }}>
                          Error
                        </h3>
                        <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                          {error}
                        </p>
                      </div>
                      <button
                        onClick={clearError}
                        style={{ 
                          color: '#dc2626', 
                          background: 'none', 
                          border: 'none',
                          fontSize: '1.125rem',
                          cursor: 'pointer'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="input-container">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your marketing strategy..."
                  className="main-textarea"
                  rows={3}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim() || isLoading}
                  className="send-button"
                >
                  {isLoading ? (
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      border: '2px solid #e5e7eb',
                      borderTop: '2px solid #9ca3af',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  ) : (
                    <span>↑</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CleanChatInterface; 