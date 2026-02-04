const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const Badge = require("../models/Badge");

// --- TEAMS ---

// Create a new team
router.post("/teams", async (req, res) => {
    try {
        const { name, hackathonId, members } = req.body;
        const newTeam = new Team({
            name,
            hackathonId,
            members: members || [] // [{ name: "Alice", role: "Frontend" }]
        });
        const savedTeam = await newTeam.save();
        res.status(201).json(savedTeam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get team by Hackathon ID (Assuming 1 team per hackathon for this user for now, or list all)
router.get("/teams/:hackathonId", async (req, res) => {
    try {
        const teams = await Team.find({ hackathonId: req.params.hackathonId });
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update member status
router.put("/teams/:teamId/members/:memberId", async (req, res) => {
    try {
        const { status } = req.body;
        const team = await Team.findById(req.params.teamId);
        if (!team) return res.status(404).json({ error: "Team not found" });

        const member = team.members.id(req.params.memberId);
        if (!member) return res.status(404).json({ error: "Member not found" });

        member.status = status;
        await team.save();
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Tasks
router.put("/teams/:teamId/tasks", async (req, res) => {
    try {
        const { tasks } = req.body;
        const team = await Team.findByIdAndUpdate(
            req.params.teamId,
            { tasks },
            { new: true }
        );
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// --- BADGES ---

// Get all badges
router.get("/badges", async (req, res) => {
    try {
        // Retrieve all badge definitions from DB
        // If DB is empty, seed some defaults (for demo purposes)
        let badges = await Badge.find();
        if (badges.length === 0) {
            const defaults = [
                { id: "first_hack", name: "First Steps", description: "Logged your first hackathon", icon: "🚀", category: "Milestone", isUnlocked: false },
                { id: "panic_mode", name: "Survivor", description: "Survived Panic Mode", icon: "🔥", category: "Endurance", isUnlocked: false },
                { id: "team_player", name: "Squad Goals", description: "Created a team", icon: "🤝", category: "Social", isUnlocked: false },
            ];
            badges = await Badge.insertMany(defaults);
        }
        res.json(badges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Unlock a badge (Manually or via logic)
router.post("/badges/:id/unlock", async (req, res) => {
    try {
        const badge = await Badge.findOneAndUpdate(
            { id: req.params.id },
            { isUnlocked: true, unlockedAt: new Date() },
            { new: true }
        );
        res.json(badge);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
