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
        return '🎯';
      case 'openai':
        return '🤖';
      case 'gemini':
        return '💎';
      case 'gpt35':
        return '⚡';
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

  const quickPrompts = [
    "Create a social media strategy for my startup",
    "How should I allocate my marketing budget?",
    "What's the best way to get first customers?",
    "Help me plan a product launch campaign"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-100">
      {/* Fixed Header */}
      <header className="flex-shrink-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-4 shadow-lg relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative flex justify-between items-center max-w-6xl mx-auto">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <div className="bg-white rounded-lg p-2">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LaunchAI
                </h1>
              </div>
              <div className="bg-green-500 rounded-full w-2 h-2 animate-pulse"></div>
            </div>
            <p className="text-blue-100 text-sm">Your AI Marketing Strategy Assistant</p>
            <p className="text-xs text-blue-200 mt-1 flex items-center space-x-2">
              <span>Powered by Claude 🎯</span>
              <span>•</span>
              <span>GPT-4o Fallback 🤖</span>
              <span>•</span>
              <span>Always Available ⚡</span>
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowUserDataForm(!showUserDataForm)}
              className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
                showUserDataForm 
                  ? 'bg-white text-blue-600 shadow-lg' 
                  : 'bg-blue-500 hover:bg-blue-400 text-white'
              }`}
            >
              {showUserDataForm ? '✓ Business Info' : '👤 Business Info'}
            </button>
            <button
              onClick={clearMessages}
              className="px-3 py-2 bg-red-500 hover:bg-red-400 rounded-lg transition-colors font-medium text-sm"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Business Info Form (when expanded) */}
      {showUserDataForm && (
        <div className="flex-shrink-0 bg-gradient-to-r from-gray-50 to-blue-50 border-b p-4 shadow-inner z-10">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
              <span className="bg-blue-100 rounded-lg p-1 mr-2 text-sm">👤</span>
              Tell us about your business for personalized strategies
            </h3>
            <form onSubmit={handleUserDataSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Business Type
                </label>
                <input
                  type="text"
                  value={userData.businessType || ''}
                  onChange={(e) => setUserData(prev => ({ ...prev, businessType: e.target.value }))}
                  placeholder="e.g., SaaS, E-commerce"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={userData.targetAudience || ''}
                  onChange={(e) => setUserData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="e.g., Small businesses"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Marketing Goals
                </label>
                <input
                  type="text"
                  value={userData.goals || ''}
                  onChange={(e) => setUserData(prev => ({ ...prev, goals: e.target.value }))}
                  placeholder="e.g., Lead generation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Monthly Budget
                </label>
                <input
                  type="text"
                  value={userData.budget || ''}
                  onChange={(e) => setUserData(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="e.g., $5,000/month"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    Welcome to LaunchAI!
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    I'm your AI marketing strategist powered by Claude with smart fallbacks. 
                    I can help you create comprehensive marketing strategies, campaigns, and growth plans.
                  </p>
                </div>

                {/* Quick Start Prompts */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-3">
                    Try these prompts to get started:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {quickPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 p-3 rounded-lg text-left transition-all duration-200 border border-gray-200 hover:border-blue-300 hover:shadow-md text-sm"
                      >
                        <span className="text-gray-700 font-medium">"{prompt}"</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Capabilities - Compact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <span className="mr-1">📊</span>
                      Strategy & Planning
                    </h3>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Marketing strategy development</li>
                      <li>• Campaign planning</li>
                      <li>• Budget allocation</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                      <span className="mr-1">🎯</span>
                      Digital Marketing
                    </h3>
                    <ul className="text-purple-700 space-y-1">
                      <li>• Social media strategy</li>
                      <li>• SEO & content marketing</li>
                      <li>• Paid advertising</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-indigo-800 mb-2 flex items-center">
                      <span className="mr-1">📈</span>
                      Growth & Analytics
                    </h3>
                    <ul className="text-indigo-700 space-y-1">
                      <li>• Customer acquisition</li>
                      <li>• Conversion optimization</li>
                      <li>• Performance tracking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-4xl p-4 rounded-2xl shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-100'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</div>
                <div className={`text-xs mt-2 flex justify-between items-center ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.role === 'assistant' && message.provider && (
                    <span className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                      <span>{getProviderIcon(message.provider)}</span>
                      <span className="font-medium text-xs">{getProviderName(message.provider)}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-gray-600 font-medium text-sm">LaunchAI is thinking...</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Using Claude 🎯 with smart fallbacks for best results
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-red-800 font-semibold flex items-center text-sm">
                    <span className="mr-2">❌</span>
                    Error
                  </h3>
                  <p className="text-red-600 mt-1 text-sm">{error}</p>
                  <p className="text-red-500 text-xs mt-1">
                    Our fallback system ensures maximum reliability. Please try again.
                  </p>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-600 text-lg font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="flex-shrink-0 border-t bg-white p-4 shadow-lg z-10">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about marketing strategies, campaigns, budget allocation, or any business growth questions..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 focus:bg-white transition-all duration-200 text-sm"
                  disabled={isLoading}
                />
                <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                  Press Enter to send, Shift+Enter for new line
                </div>
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
