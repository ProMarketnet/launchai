import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
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

interface Insights {
  timing: string
  platforms: string
  content: string
  source: string
}

export default function LaunchAI() {
  const { data: session, status } = useSession()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileComplete, setProfileComplete] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showConversation, setShowConversation] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [insights, setInsights] = useState<Insights | null>(null)
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

  // Load profile on mount
  useEffect(() => {
    if (session) {
      loadProfile()
    }
  }, [session])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const profile = await response.json()
        if (profile) {
          setProfileData(profile)
          setProfileComplete(profile.completed)
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  }

  const handleStartProfile = () => {
    setShowProfileModal(true)
    setCurrentQuestion(0)
  }

  const handleQuestionAnswer = async (answer: string) => {
    const currentKey = questions[currentQuestion].key
    const updatedProfile = { ...profileData, [currentKey]: answer }
    setProfileData(updatedProfile)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Complete profile
      try {
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProfile),
        })
        
        if (response.ok) {
          setProfileComplete(true)
          setShowProfileModal(false)
          // Reload to get insights
          setTimeout(() => window.location.reload(), 500)
        }
      } catch (error) {
        console.error('Failed to save profile:', error)
      }
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    // Start conversation if first message
    if (!showConversation) {
      setShowConversation(true)
      setMessages([
        {
          id: 1,
          type: 'user',
          content: inputValue,
          timestamp: new Date()
        }
      ])
    } else {
      // Add message to existing conversation
      const newMessage: Message = {
        id: messages.length + 1,
        type: 'user',
        content: inputValue,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, newMessage])
    }

    const messageToSend = inputValue
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          conversationId: conversationId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        const aiResponse: Message = {
          id: messages.length + 2,
          type: 'ai',
          content: data.message,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, aiResponse])
        setConversationId(data.conversationId)
        
        if (data.insights) {
          setInsights(data.insights)
        }
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const downloadReport = async () => {
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = 'marketing-strategy.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to download report:', error)
    }
  }

  // Show login if not authenticated
  if (status === 'loading') {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">LaunchAI</h1>
            <button
              onClick={() => signIn('google')}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Sign In
            </button>
          </div>
        </header>
        
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-normal text-gray-900 mb-8">Create your marketing strategy with AI</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get personalized marketing recommendations, platform strategies, and launch timing based on your product and audience.
          </p>
          <button
            onClick={() => signIn('google')}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Get Started - Sign In with Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white"></div>
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
              <a href="#" className="hover:text-gray-900">API Platform</a>
              <a href="#" className="hover:text-gray-900">Company</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="text-sm text-gray-600">{session.user?.name}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
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
                    💡 {profileComplete ? 'Profile complete!' : 'Get personalized marketing recommendations:'} {' '}
                    <button 
                      onClick={handleStartProfile}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {profileComplete ? 'View profile' : 'Create your marketing profile'}
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
                    <span className="text-sm font-medium text-gray-900">New</span>
                    <span className="text-sm text-gray-600">
                      Powered by OpenAI with specialized marketing strategy tools, social media APIs, and audience research integrations.
                    </span>
                  </div>
                  <button className="text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap ml-4">
                    See integrations
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Chat Interface
            <div className="max-w-3xl mx-auto">
              {/* Strategy Insights */}
              {profileComplete && insights && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Your Marketing Strategy</h2>
                  
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
                        <h3 className="font-medium text-sm text-gray-900">Content Type</h3>
                      </div>
                      <p className="text-xs text-gray-700 mb-1">{insights.content}</p>
                      <p className="text-xs text-gray-500">Industry benchmark</p>
                    </div>
                  </div>

                  <div className="flex space-x-3 justify-center">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      📧 Email Strategy
                    </button>
                    <button 
                      onClick={downloadReport}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      📄 Download PDF
                    </button>
                    <button className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors">
                      🚀 Launch Mode
                    </button>
                  </div>
                </div>
              )}

              {/* Profile prompt */}
              {!profileComplete && (
                <div className="mb-6 text-center">
                  <div className="bg-blue-50 border border-blue-
