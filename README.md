# HackLog - Hackathon Journey Logger

A full-stack application to track and analyze your hackathon performance, learn from failures, and improve execution.

## 🚀 Features

- **Dashboard Analytics** - Track completion rates, risk scores, and performance metrics
- **Failure Logging** - Document what went wrong and when
- **Smart Insights** - Get personalized recommendations for your next hackathon
- **Profile Management** - Track your tech stack and experience level
- **Risk Assessment** - Identify your riskiest phases and categories

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB database (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lucifer-0612/HackLog-Log-your-Hackathon-Journey.git
   cd HackLog-Log-your-Hackathon-Journey
   ```

2. **Setup Server**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env and add your MongoDB connection string
   npm install
   npm run dev
   ```

3. **Setup Client**
   ```bash
   cd ../client
   cp .env.example .env.local
   # Edit .env.local if needed (default: http://localhost:5000)
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🌐 Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel with automatic deployments from the main branch.

### Backend
Deploy the backend to Railway, Render, or any Node.js hosting platform.

## 📝 Environment Variables

### Server (.env)
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### Client (.env.local)
```
NEXT_PUBLIC_API_URL=your_backend_api_url
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Ashutosh Kesarwani** ([@Lucifer-0612](https://github.com/Lucifer-0612))

---

Made with ❤️ for hackathon enthusiasts
