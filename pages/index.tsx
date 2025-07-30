import { useState } from 'react'

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
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Header */}
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
            <div className="user-info">
              <span>👤</span>
              <span>MVP Tester</span>
            </div>
          </div>
        </div>
      </header>

      <div className="main-container">
        <div className="content-wrapper">
          {!showConversation ? (
            // Initial Homepage
            <div className="homepage">
              <h1 className="main-title">Create your marketing strategy with AI</h1>
              
              <div className="input-section">
                <div className="input-container">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Help me market my new SaaS product on social media"
                    className="main-textarea"
                    rows={3}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="send-button"
                  >
                    <span>↑</span>
                  </button>
                </div>
                
                <div className="profile-prompt">
                  💡 {profileComplete ? 'Profile complete! Getting personalized recommendations' : 'Get personalized marketing recommendations:'} {' '}
                  <button 
                    onClick={handleStartProfile}
                    className="profile-link"
                  >
                    {profileComplete ? 'Update profile' : 'Create your marketing profile'}
                  </button>
                </div>
              </div>

              <div className="suggestions">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(suggestion)}
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
                    <span className="banner-title">MVP Demo</span>
                    <span className="banner-text">
                      Personalized AI responses based on your marketing profile
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Chat Interface - Simple for now
            <div className="chat-container">
              <div className="messages">
                {messages.map((message) => (
                  <div key={message.id} style={{ 
                    display: 'flex', 
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      maxWidth: '42rem',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: message.type === 'user' ? '#111827' : '#f9fafb',
                      color: message.type === 'user' ? 'white' : '#111827',
                      border: message.type === 'ai' ? '1px solid #d1d5db' : 'none'
                    }}>
                      <p style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                        {message.content}
                      </p>
                      <p style={{ 
                        fontSize: '0.75rem', 
                        marginTop: '0.5rem',
                        color: message.type === 'user' ? '#d1d5db' : '#6b7280'
                      }}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem'
                    }}>
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
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="input-container">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your marketing strategy..."
                  className="main-textarea"
                  rows={3}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="send-button"
                >
                  <span>↑</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            maxWidth: '42rem',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#111827'
                }}>Marketing Profile</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  style={{
                    color: '#9ca3af',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.125rem',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: '0.5rem',
                          height: '0.5rem',
                          borderRadius: '50%',
                          backgroundColor: index <= currentQuestion ? '#3b82f6' : '#d1d5db'
                        }}
                      />
                    ))}
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    {currentQuestion + 1} of {questions.length}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  {questions[currentQuestion].question}
                </h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionAnswer(option)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        backgroundColor: 'white',
                        color: '#111827',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                        e.currentTarget.style.borderColor = '#9ca3af'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }}
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
