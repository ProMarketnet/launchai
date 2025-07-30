import React, { useState, useRef, useEffect } from 'react';
import { useClaudeChat, UserData } from '../hooks/useClaudeChat';

const ChatInterface: React.FC = () => {
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

  const getProviderIcon = (provider?: string) => {
    switch (provider) {
      case 'claude':
        return '🎯'; // Claude primary
      case 'openai':
        return '🤖'; // OpenAI fallback
      case 'gemini':
        return '💎'; // Gemini fallback
      case 'gpt35':
        return '⚡'; // GPT-3.5 emergency
      default:
        return '🤔';
    }
  };

  const getProviderName = (provider?: string) => {
    switch (provider) {
      case 'claude':
        return 'Claude';
      case 'openai':
        return 'GPT-4o';
      case 'gemini':
        return 'Gemini';
      case 'gpt35':
        return 'GPT-3.5';
      default:
        return 'AI';
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">LaunchAI</h1>
            <p className="text-blue-100">Your AI Marketing Strategy Assistant</p>
            <p className="text-xs text-blue-200 mt-1">
              Powered by Claude 🎯 with GPT-4o 🤖 fallback
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowUserDataForm(!showUserDataForm)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors"
            >
              Business Info
            </button>
            <button
              onClick={clearMessages}
              className="px-4 py-2 bg-red-500 hover:bg-red-400 rounded-lg transition-colors"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </header>

      {/* Business Info Form */}
      {showUserDataForm && (
        <div className="bg-gray-50 border-b p-4">
          <form onSubmit={handleUserDataSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Type
              </label>
              <input
                type="text"
                value={userData.businessType || ''}
                onChange={(e) => setUserData(prev => ({ ...prev, businessType: e.target.value }))}
                placeholder="e.g., SaaS, E-commerce, Consulting"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={userData.targetAudience || ''}
                onChange={(e) => setUserData(prev => ({ ...prev, targetAudience: e.target.value }))}
                placeholder="e.g., Small business owners, Millennials"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marketing Goals
              </label>
              <input
                type="text"
                value={userData.goals || ''}
                onChange={(e) => setUserData(prev => ({ ...prev, goals: e.target.value }))}
                placeholder="e.g., Lead generation, Brand awareness"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Budget
              </label>
              <input
                type="text"
                value={userData.budget || ''}
                onChange={(e) => setUserData(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="e.g., $5,000/month"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Welcome to LaunchAI! 🚀
              </h2>
              <p className="mb-4">
                I'm your AI marketing strategist powered by Claude with smart fallbacks. I can help you with:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-blue-600 mb-2">Strategy & Planning</h3>
                  <ul className="text-left space-y-1">
                    <li>• Marketing strategy development</li>
                    <li>• Campaign planning</li>
                    <li>• Budget allocation</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-purple-600 mb-2">Digital Marketing</h3>
                  <ul className="text-left space-y-1">
                    <li>• Social media strategy</li>
                    <li>• SEO & content marketing</li>
                    <li>• Paid advertising</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Start by telling me about your business or asking a specific marketing question!
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className={`text-xs mt-2 flex justify-between items-center ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                <span>{message.timestamp.toLocaleTimeString()}</span>
                {message.role === 'assistant' && message.provider && (
                  <span className="flex items-center space-x-1">
                    <span>{getProviderIcon(message.provider)}</span>
                    <span>{getProviderName(message.provider)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">LaunchAI is thinking...</span>
                <span className="text-xs text-gray-400">
                  (Using Claude 🎯 with smart fallbacks)
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <p className="text-red-500 text-xs mt-2">
                  Our fallback system ensures maximum reliability. Please try again.
                </p>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about marketing strategies, campaigns, or any business growth questions..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Send'
            )}
          </button>
        </form>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
