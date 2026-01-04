# HackLog - Hackathon Journey Logger

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://hacklog.netlify.app)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/hacklog/deploys)

A full-stack application to track and analyze your hackathon performance, learn from failures, and improve execution.

**🌐 Live Demo:** [https://hacklog.netlify.app](https://hacklog.netlify.app)

---

## 🚀 Features

- **Dashboard Analytics** - Track completion rates, risk scores, and performance metrics
- **Failure Logging** - Document what went wrong and when
- **Smart Insights** - Get personalized recommendations for your next hackathon
- **Profile Management** - Track your tech stack and experience level
- **Risk Assessment** - Identify your riskiest phases and categories

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

### Deployment
- **Frontend:** Netlify (with Essential Next.js Plugin)
- **Backend:** Render

---

## 📦 Local Development

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

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   
   Create `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
   
   Start the server:
   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```
   
   Create `.env.local` file (optional):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
   
   Start the development server:
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## 🌐 Deployment

### Frontend (Netlify)
The frontend is deployed on Netlify with automatic deployments from the master branch.

**Configuration:** See `netlify.toml` for build settings.

### Backend (Render)
The backend is deployed on Render with automatic deployments.

**Environment Variables Required:**
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Ashutosh Kesarwani**
- GitHub: [@Lucifer-0612](https://github.com/Lucifer-0612)
- Project Link: [https://github.com/Lucifer-0612/HackLog-Log-your-Hackathon-Journey](https://github.com/Lucifer-0612/HackLog-Log-your-Hackathon-Journey)

---

Made with ❤️ for hackathon enthusiasts
