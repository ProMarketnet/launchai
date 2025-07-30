# LaunchAI 🚀

An AI-powered marketing strategy platform that helps businesses create personalized marketing plans, campaigns, and strategies using Claude AI.

## 🔧 Technology Stack

### Frontend
- **Next.js 14** - React framework with Pages Router
- **TypeScript** - Type-safe JavaScript
- **React 18.2** - UI library
- **Tailwind CSS 3.3** - Utility-first CSS framework

### Backend & API
- **Next.js API Routes** - Serverless API endpoints
- **Anthropic Claude AI** - Primary AI model for marketing strategy generation
- **Prisma ORM** - Database toolkit and ORM
- **NextAuth.js** - Authentication library

### Database
- **Prisma Client** - Database client
- **PostgreSQL/MySQL** - (configured via Prisma schema)

### Deployment & DevOps
- **Railway** - Cloud deployment platform
- **Git** - Version control

## 📁 Project Structure

```
launchai/
├── components/
│   └── ChatInterface.tsx          # Main chat UI component
├── hooks/
│   └── useClaudeChat.ts          # React hook for Claude API integration
├── lib/
│   └── claude.ts                 # Claude AI service and API client
├── pages/
│   ├── api/
│   │   └── chat.ts              # API endpoint for Claude integration
│   └── index.tsx                # Main application page
├── prisma/
│   └── schema.prisma            # Database schema
├── styles/
│   └── globals.css              # Global styles and Tailwind imports
├── .env.local                   # Environment variables (not committed)
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🎯 Key Features Implemented

### ✅ Completed
- **Claude AI Integration** - Primary AI provider for marketing strategies
- **Chat Interface** - Real-time conversation UI with Claude
- **TypeScript Support** - Full type safety across the application
- **Responsive Design** - Mobile-friendly Tailwind CSS styling
- **Error Handling** - Comprehensive error management
- **Loading States** - User feedback during AI processing
- **Message History** - Conversation tracking within sessions
- **Marketing-Focused Prompts** - Specialized system prompts for business advice

### 🚧 Ready to Implement
- **API Fallback System** - Multiple AI providers (OpenAI GPT-4, Google Gemini)
- **User Authentication** - Login/signup with NextAuth
- **Conversation Persistence** - Save chat history to database
- **User Profiles** - Marketing preferences and business data
- **Rate Limiting** - API usage protection
- **Caching Layer** - Performance optimization
- **Analytics Dashboard** - Usage tracking and insights
- **Export Features** - PDF/Word strategy documents

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
# Claude AI API Key
ANTHROPIC_API_KEY=your_claude_api_key_here

# Database (if using Prisma)
DATABASE_URL="your_database_connection_string"

# NextAuth (for future authentication)
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ProMarketnet/launchai.git
   cd launchai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Add your Claude API key from Anthropic Console

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Dependencies

### Core Dependencies
```json
{
  "@anthropic-ai/sdk": "^0.27.0",
  "next": "14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "latest"
}
```

### Additional Tools
- **Prisma** - Database management
- **NextAuth** - Authentication (ready for implementation)
- **Tailwind CSS** - Styling framework
- **Autoprefixer** - CSS processing

## 🔄 Deployment

### Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy
railway up
```

### Environment Variables in Railway
- `ANTHROPIC_API_KEY` - Your Claude API key
- `DATABASE_URL` - Database connection string
- Any additional variables from `.env.local`

## 🧩 API Endpoints

### `/api/chat` (POST)
Primary endpoint for Claude AI interactions.

**Request:**
```json
{
  "message": "Create a social media strategy for my SaaS",
  "userData": {
    "businessType": "SaaS",
    "targetAudience": "Small businesses",
    "goals": "Lead generation",
    "budget": "$5,000/month"
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": "Here's your personalized marketing strategy...",
  "usage": {
    "input_tokens": 150,
    "output_tokens": 800
  }
}
```

## 🔧 Development Notes

### Current AI Provider
- **Primary:** Claude 3.5 Sonnet (Anthropic)
- **Model:** `claude-3-5-sonnet-20241022`
- **Max Tokens:** 4000
- **Temperature:** 0.7

### Ready for Multi-Provider Setup
The architecture supports easy addition of:
- OpenAI GPT-4/GPT-3.5
- Google Gemini Pro
- Custom fallback logic
- Load balancing between providers

### Database Schema
Using Prisma ORM - ready for:
- User management
- Conversation history
- Marketing profiles
- Usage analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

[Add your license here]

## 🆘 Support

For support or questions:
- Create an issue on GitHub
- Check the documentation
- Review the API integration guides

---

**Last Updated:** January 2025  
**Version:** 0.1.0  
**Status:** Active Development
