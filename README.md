# Intelliviews

**Revolutionizing the Hiring Process Through AI-Powered Interviews**

## 🎯 Mission

Intelliviews reimagines how companies evaluate talent by replacing traditional interview processes with intelligent AI agents and immersive virtual working environments. We leverage cutting-edge AI development to create fair, efficient, and insightful hiring experiences that go beyond surface-level assessments.

## 🚀 The Problem We're Solving

Traditional hiring processes are:
- **Time-consuming** — Multiple rounds of interviews requiring significant time from both candidates and interviewers
- **Inconsistent** — Outcomes heavily influenced by interviewer bias and subjective judgment
- **Superficial** — Limited insight into how candidates actually solve real problems
- **Stressful** — High-pressure environments that don't reflect actual work conditions

## 💡 Our Solution

Intelliviews transforms hiring by:

### 🤖 AI-Agent Interviewers
- Intelligent agents conduct dynamic, personalized interviews
- Adaptive questioning based on candidate responses
- Unbiased evaluation using consistent criteria
- Real-time assessment of technical and soft skills

### 🏢 Virtual Working Environment
- Candidates work in realistic project scenarios
- Demonstrate problem-solving in action, not just in conversation
- Showcase real-world collaboration and communication
- Leave a portfolio of actual work outputs

### 📊 Data-Driven Insights
- Comprehensive performance metrics
- Detailed skill assessment reports
- Predictive hiring signals
- Reduced hiring bias through standardized evaluation

## 🛠️ Technology Stack

- **Frontend:** Next.js 15, TypeScript, React, TailwindCSS
- **AI Services:**
  - Claude Sonnet 4 (Anthropic) - Code review and behavioral interview agents
  - ElevenLabs Voice AI - Text-to-speech for natural conversation
  - Web Speech API - Voice input and transcription
- **Database:** MongoDB Atlas with Mongoose
- **Email:** Nodemailer with Gmail SMTP
- **Deployment:** Vercel
- **Code Editor:** Monaco Editor (VS Code in browser)

## ✨ Features

### 📧 Automated Interview Invitations
- Send branded email invitations to candidates
- Personalized interview links with embedded candidate information
- Professional email templates with interview instructions

### 💻 Technical Interview
- **Interactive Code Editor:** Browser-based Monaco editor with syntax highlighting
- **Check Code Feature:** AI-powered code review with 3-attempt limit
  - Interviewer-style guidance (hints, not solutions)
  - Context-aware feedback based on task and starter code
  - Encourages critical thinking through questions
- **Code Execution:** Run and test code in real-time
- **Performance Analysis:** AI-powered performance assessment

### 🗣️ Behavioral Interview
- **Conversational Chatbot:** Natural dialogue-based interview
- **Voice AI Integration:** 
  - Text-to-speech responses using ElevenLabs
  - Voice input for hands-free interaction
  - Real-time transcription
  - Manual replay buttons for each message
- **Context-Aware AI:** Maintains conversation history for relevant follow-ups
- **Session Recording:** Complete conversation saved to database

### 📊 Company Dashboard
- View all candidate responses
- Access detailed interview transcripts
- Review performance metrics
- Export candidate data

## 👥 Team

- Jason
- Patricia
- Paddy

## 🎓 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Anthropic API key (Claude)
- ElevenLabs API key
- Gmail account for sending emails (with app password)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Medata/intelliviews
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the `intelliviews` directory:
   ```env
   # Email Configuration
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password

   # API Keys
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ELEVENLABS_API_KEY=sk_...

   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

   # Application URL
   APP_URL=http://localhost:3000
   ```

4. **Configure MongoDB Atlas**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a cluster or use existing one
   - Navigate to **Network Access**
   - Add your IP address or use `0.0.0.0/0` for development
   - Get your connection string and add it to `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory** to `intelliviews`
   - Framework Preset: Next.js

3. **Configure Environment Variables**
   
   Add these in Vercel project settings → Environment Variables:
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `ANTHROPIC_API_KEY`
   - `ELEVENLABS_API_KEY`
   - `MONGODB_URI`
   - `APP_URL` (your production URL)

4. **Deploy**
   - Vercel will automatically build and deploy
   - Update `APP_URL` in environment variables with your production URL

5. **Update MongoDB Whitelist**
   - In MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (to allow Vercel's dynamic IPs)

## 📝 API Routes

- `/api/send-interview-email` - Send interview invitations
- `/api/behavioral-ai` - Behavioral interview chatbot
- `/api/text-to-speech` - Convert text to speech
- `/api/check-code` - AI code review with guidance
- `/api/analyze-performance` - Analyze candidate performance
- `/api/save-response` - Save interview responses
- `/api/get-responses` - Retrieve candidate responses
- `/api/test-db` - Test database connection

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Use Gmail app passwords (not regular passwords)
- Whitelist only necessary IPs in MongoDB (or use 0.0.0.0/0 with strong auth)
- Rotate API keys regularly

## 📄 License

[Add license information]

---

**The future of hiring is here. Let's interview smarter.** 