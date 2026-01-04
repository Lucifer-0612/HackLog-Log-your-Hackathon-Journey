const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const hackathonRoutes = require("./routes/hackathon");
const profileRoutes = require("./routes/profile");


const app = express();
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://hack-log-log-your-hackathon-journey-487eg6f2o.vercel.app',
        'https://hacklog.netlify.app'
    ],
    credentials: true
}));
app.use(express.json());
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/profile", profileRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err.message);
        console.error("Check your MONGO_URI in .env file");
    });

app.get("/", (req, res) => {
    res.send("HackLog API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


