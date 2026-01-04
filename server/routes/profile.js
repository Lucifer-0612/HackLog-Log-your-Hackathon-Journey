const express = require("express");
const router = express.Router();
const Hackathon = require("../models/Hackathon");

// Get user profile with aggregated statistics
router.get("/", async (req, res) => {
    try {
        const hackathons = await Hackathon.find();

        if (hackathons.length === 0) {
            // Return default profile if no hackathons exist
            return res.json({
                _id: "default",
                name: "Anonymous Hacker",
                experienceLevel: "Beginner",
                techStack: [],
                totalHackathons: 0,
                averageCompletionRate: 0
            });
        }

        // Calculate total hackathons
        const totalHackathons = hackathons.length;

        // Calculate average completion rate
        const totalCompletionRate = hackathons.reduce((sum, h) => {
            if (h.plannedFeatures > 0) {
                return sum + (h.completedFeatures / h.plannedFeatures) * 100;
            }
            return sum;
        }, 0);
        const averageCompletionRate = Math.round(totalCompletionRate / totalHackathons);

        // Determine experience level based on hackathons completed
        let experienceLevel = "Beginner";
        if (totalHackathons >= 20) {
            experienceLevel = "Expert";
        } else if (totalHackathons >= 10) {
            experienceLevel = "Advanced";
        } else if (totalHackathons >= 5) {
            experienceLevel = "Intermediate";
        }

        // Extract unique tech stack from failure categories (simplified)
        // In a real app, you'd have a separate tech stack field
        const techStack = ["React", "Node.js", "TypeScript", "MongoDB", "Express"];

        res.json({
            _id: "user_profile",
            name: "Anonymous Hacker",
            experienceLevel,
            techStack,
            totalHackathons,
            averageCompletionRate
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
