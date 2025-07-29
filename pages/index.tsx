import { useState } from 'react'
import { ArrowUp, User, X } from 'lucide-react'

interface Message {
  id: number
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface ProfileData {
  productType: string
  audience: string
  budget: string
  timeline: string
  goals: string
  team: string
  experience: string
  platforms: string
}

export default function LaunchAI() {
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileComplete, setProfileComplete] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showConversation, setShowConversation] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    productType: '',
    audience: '',
    budget: '',
    timeline: '',
    goals: '',
    team: '',
    experience: '',
    platforms: ''
  })

  const questions = [
    {
      question: "What type of product are you launching?",
      options: ['SaaS/Software', 'Physical Product', 'Service/Consulting', 'Mobile App', 'E-commerce Store', 'Other'],
      key: 'productType' as keyof ProfileData
    },
    {
      question: "Who is your target audience?",
      options: ['Business decision-makers (B2B)', 'End users/consumers (B2C)', 'Small business owners', 'Developers/Technical users', 'Creative professionals', 'General consumers'],
      key: 'audience' as keyof ProfileData
    },
    {
      question: "What's your content creation budget?",
      options: ['Under $500', '$500 - $2,000', '$2,000 - $5,000', '$5,000+', 'DIY/Internal team'],
      key: 'budget' as keyof ProfileData
    },
    {
      question: "When do you want to launch?",
      options: ['Within 2 weeks', '1 month', '2-3 months', '3-6 months', 'Still planning'],
      key: 'timeline' as keyof ProfileData
    },
    {
      question: "What's your primary goal?",
      options: ['Get first customers', 'Build brand awareness', 'Generate leads', 'Drive website traffic', 'Build community'],
      key: 'goals' as keyof ProfileData
    },
    {
      question: "What's your team size for marketing?",
      options: ['Just me', '2-3 people', '4-10 people', '10+ people', 'Outsourced team'],
      key: 'team' as keyof ProfileData
    },
    {
      question: "Previous launch experience?",
      options: ['First time launching', 'Launched 1-2 products', 'Experienced launcher', 'Multiple successful launches'],
      key: 'experience' as keyof ProfileData
    },
    {
      question: "Preferred social platforms?",
      options: ['LinkedIn focus', 'Instagram/Visual', 'Twitter/X', 'TikTok/Video', 'All platforms', 'Unsure'],
      key: 'platforms' as keyof ProfileData
    }
  ]

  const suggestions = [
    "Market my SaaS product",
    "Social media strategy", 
    "Content marketing plan",
    "Platform selection help",
    "More"
  ]

  const mockResponses = [
    `Great question! For ${profileData.productType || 'your product'}, I'd recommend focusing on content marketing and ${profileData.audience?.includes('B2B') ? 'LinkedIn outreach to reach decision-makers' : 'social media engagement with your target audience'}.`,
    
    `Based on your ${profileData.budget || 'budget'} and ${profileData.timeline || 'timeline'}, here's a strategic approach:\n\n1) Create educational content that addresses your audience's pain points\n2) Use ${profileData.platforms || 'LinkedIn'} for networking and community building\n3) Consider product demos and free trials to showcase value`,
    
    `For your ${profileData.goals || 'goals'}, I suggest starting with 2-3 platforms where your audience is most active:\n\n• ${profileData.audience?.includes('B2B') ? 'LinkedIn for professional networking' : 'Instagram/TikTok for visual content'}\n• Content marketing blog for SEO\n• Email newsletter for direct communication`,
    
    `Given your ${profileData.experience || 'experience level'} and ${profileData.team || 'team size'}, here's what I recommend:\n\n1. Start with organic content to test messaging\n2. Focus on solving problems your customers actually have\n3. Build an email list from day one\n4. Measure everything and iterate quickly`,
    
    `For a ${profileData.timeline || '3-month'} launch timeline, here's your roadmap:\n\nWeek 1-2: Content strategy & brand messaging\nWeek 3-4: Website & landing pages\nWeek 5-6: Social media presence & community building\nWeek 7-8: Launch campaign & PR outreach\nWeek 9-12: Post-launch optimization & scaling`
  ]

  const handleStartProfile = () => {
    setShowProfileModal(true)
    setCurrentQuestion(0)
  }

  const handleQuestionAnswer = (answer: string) => {
    const currentKey = questions[currentQuestion].key
    const updatedProfile = { ...profileData, [currentKey]: answer }
    setProfileData(updatedProfile)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setProfileComplete(true)
      setShowProfileModal(false)
    }
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    if (!showConversation) {
      setShowConversation(true)
      setMessages([userMessage])
    } else {
      setMessages(prev => [...prev, userMessage])
    }

    setInputValue('')
    setIsTyping(true)

    // Simulate AI response with personalized content
    setTimeout(() => {
      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)]
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const insights = profileComplete ? {
    timing: `Launch in ${profileData.timeline} for optimal ${profileData.audience?.includes('B2B') ? 'B2B' : 'consumer'} engagement`,
    platforms: `${profileData.platforms} + ${profileData.audience?.includes('B2B') ? 'LinkedIn' : 'Instagram'} focus for your audience`,
    content: `${profileData.goals?.includes('awareness') ? 'Brand awareness content' : 'Educational content'} + product demos`,
    source: "Based on your profile"
  } : null

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-semibold text-gray-900">LaunchAI</h1>
            <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Research</a>
              <a href="#" className="hover:text-gray-900">Strategy</a>
              <a href="#" className="hover:text-gray-900">For Business</a>
              <a href="#" className="hover:text-gray-900">Campaigns</a>
              <a href="#" className="hover:text-gray-900">Analytics</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="text-sm text-gray-600">MVP Tester</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="px-6 py-12">
          {!showConversation ? (
            // Initial Homepage
            <div className="text-center">
              <h1 className="text-4xl font-normal text-gray-900 mb-8">Create your marketing strategy with AI</h1>
              
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Help me market my new SaaS product on social media"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                    rows={3}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="absolute right-3 bottom-3 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowUp className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-500">
                    💡 {profileComplete ? 'Profile complete! Getting personalized recommendations' : 'Get personalized marketing recommendations:'} {' '}
                    <button 
                      onClick={handleStartProfile}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {profileComplete ? 'Update profile' : 'Create your marketing profile'}
                    </button>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(suggestion)}
                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">MVP Demo</span>
                    <span className="text-sm text-gray-600">
                      Personalized AI responses based on your marketing profile
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Chat Interface
            <div className="max-w-3xl mx-auto">
              {/* Strategy Insights */}
              {profileComplete && insights && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Your Personalized Marketing Strategy</h2>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">📅</span>
                        </div>
                        <h3 className="font-medium text-sm text-gray-900">Optimal Timing</h3>
                      </div>
                      <p className="text-xs text-gray-700 mb-1">{insights.timing}</p>
                      <p className="text-xs text-gray-500">{insights.source}</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">🎯</span>
                        </div>
                        <h3 className="font-medium text-sm text-gray-900">Platform Mix</h3>
                      </div>
                      <p className="text-xs text-gray-700 mb-1">{insights.platforms}</p>
                      <p className="text-xs text-gray-500">For {profileData.audience?.toLowerCase()}</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">📝</span>
                        </div>
                        <h3 className="font-medium text-sm text-gray-900">Content Strategy</h3>
                      </div>
                      <p className="text-xs text-gray-700 mb-1">{insights.content}</p>
                      <p className="text-xs text-gray-500">Tailored to your goals</p>
                    </div>
                  </div>

                  <div className="flex space-x-3 justify-center">
                    <button 
                      onClick={() => alert('Email strategy feature coming soon!')}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      📧 Email Strategy
                    </button>
                    <button 
                      onClick={() => alert('PDF download feature coming soon!')}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      📄 Download Strategy
                    </button>
                    <button 
                      onClick={() => alert('Launch mode feature coming soon!')}
                      className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors"
                    >
                      🚀 Launch Mode
                    </button>
                  </div>
                </div>
              )}

              {/* Profile prompt */}
              {!profileComplete && (
                <div className="mb-6 text-center">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700 mb-2">
                      💡 Complete your profile to get personalized marketing recommendations
                    </p>
                    <button 
                      onClick={handleStartProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      Create Marketing Profile
                    </button>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="space-y-6 mb-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl rounded-lg px-4 py-3 ${
                      message.type === 'user' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-50 text-gray-900 border border-gray-200'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your marketing strategy..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                  rows={3}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="absolute right-3 bottom-3 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowUp className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Marketing Profile</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex space-x-1">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index <= currentQuestion ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {currentQuestion + 1} of {questions.length}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {questions[currentQuestion].question}
                </h3>
                
                <div className="space-y-2">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionAnswer(option)}
                      className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
