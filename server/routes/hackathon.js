const express = require("express");
const router = express.Router();
const Hackathon = require("../models/Hackathon");

// Helper function to calculate risk score
const calculateRiskScore = (hackathon) => {
    // Handle edge case where plannedFeatures is 0
    if (!hackathon.plannedFeatures || hackathon.plannedFeatures === 0) {
        return Math.min(hackathon.failures.length * 10, 100);
    }

    const completionRate = hackathon.completedFeatures / hackathon.plannedFeatures;
    const failureCount = hackathon.failures.length;
    const baseRisk = (1 - completionRate) * 100;
    const failurePenalty = Math.min(failureCount * 5, 50);
    const score = Math.round(baseRisk + failurePenalty);

    // Ensure we return a valid number between 0 and 100
    return Math.max(0, Math.min(100, isNaN(score) ? 0 : score));
};

// Helper function to determine riskiest phase
const determineRiskiestPhase = (failures) => {
    if (failures.length === 0) return 'Final Hours';

    const phaseCounts = failures.reduce((acc, f) => {
        acc[f.phase] = (acc[f.phase] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(phaseCounts).sort((a, b) => b[1] - a[1])[0][0];
};

// Helper function to generate insights
const generateInsights = (hackathon) => {
    const insights = [];
    const completionRate = hackathon.completedFeatures / hackathon.plannedFeatures;

    // Scope management insights
    if (completionRate < 0.6) {
        insights.push({
            _id: `${hackathon._id}_scope`,
            hackathonId: hackathon._id,
            rule: `Reduce initial scope by ${Math.round((1 - completionRate) * 100)}% - you consistently overestimate capacity`,
            priority: 'high',
            category: 'Scope Management'
        });
    }

    // Time management insights
    const finalHourFailures = hackathon.failures.filter(f => f.phase === 'Final Hours').length;
    if (finalHourFailures > 3) {
        insights.push({
            _id: `${hackathon._id}_time`,
            hackathonId: hackathon._id,
            rule: 'Freeze features by mid-hackathon to avoid last-minute chaos',
            priority: 'high',
            category: 'Time Management'
        });
    }

    // Tech insights
    const techFailures = hackathon.failures.filter(f => f.category === 'Tech').length;
    if (techFailures > 0) {
        insights.push({
            _id: `${hackathon._id}_tech`,
            hackathonId: hackathon._id,
            rule: 'Test integrations early - tech debt compounds exponentially',
            priority: 'medium',
            category: 'Technical'
        });
    }

    // General insights
    insights.push({
        _id: `${hackathon._id}_demo`,
        hackathonId: hackathon._id,
        rule: 'Prepare demo 12 hours earlier than you think you need',
        priority: 'medium',
        category: 'Presentation'
    });

    insights.push({
        _id: `${hackathon._id}_breaks`,
        hackathonId: hackathon._id,
        rule: 'Schedule mandatory breaks to maintain focus quality',
        priority: 'low',
        category: 'Team Health'
    });

    return insights;
};

// Create hackathon
router.post("/", async (req, res) => {
    try {
        // Calculate duration from dates if not provided
        let duration = req.body.duration;
        if (!duration && req.body.startDate && req.body.endDate) {
            const start = new Date(req.body.startDate);
            const end = new Date(req.body.endDate);
            duration = Math.round((end - start) / (1000 * 60 * 60)); // hours
        }

        const hackathonData = {
            ...req.body,
            duration: duration || 0,
            riskScore: 0,
            riskiestPhase: 'Final Hours'
        };

        const hackathon = new Hackathon(hackathonData);

        // Calculate risk metrics
        hackathon.riskScore = calculateRiskScore(hackathon);
        hackathon.riskiestPhase = determineRiskiestPhase(hackathon.failures);

        const saved = await hackathon.save();
        res.json(saved);
    } catch (error) {
        console.error("Error creating hackathon:", error);
        res.status(500).json({
            error: error.message,
            details: error.errors ? Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            })) : null
        });
    }
});

// Get all hackathons (sorted by most recent)
router.get("/", async (req, res) => {
    try {
        const data = await Hackathon.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single hackathon by ID
router.get("/:id", async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);
        if (!hackathon) {
            return res.status(404).json({ error: "Hackathon not found" });
        }
        res.json(hackathon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update hackathon
router.put("/:id", async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);
        if (!hackathon) {
            return res.status(404).json({ error: "Hackathon not found" });
        }

        // Update fields
        Object.assign(hackathon, req.body);

        // Recalculate risk metrics
        hackathon.riskScore = calculateRiskScore(hackathon);
        hackathon.riskiestPhase = determineRiskiestPhase(hackathon.failures);

        const updated = await hackathon.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete hackathon
router.delete("/:id", async (req, res) => {
    try {
        const hackathon = await Hackathon.findByIdAndDelete(req.params.id);
        if (!hackathon) {
            return res.status(404).json({ error: "Hackathon not found" });
        }
        res.json({ message: "Hackathon deleted successfully", _id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get hackathon failures
router.get("/:id/failures", async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);
        if (!hackathon) {
            return res.status(404).json({ error: "Hackathon not found" });
        }
        res.json(hackathon.failures);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add failure to hackathon
router.post("/:id/failure", async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);
        if (!hackathon) {
            return res.status(404).json({ error: "Hackathon not found" });
        }

        hackathon.failures.push(req.body);

        // Recalculate risk metrics
        hackathon.riskScore = calculateRiskScore(hackathon);
        hackathon.riskiestPhase = determineRiskiestPhase(hackathon.failures);

        await hackathon.save();
        res.json(hackathon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get hackathon insights
router.get("/:id/insights", async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);
        if (!hackathon) {
            return res.status(404).json({ error: "Hackathon not found" });
        }

        const insights = generateInsights(hackathon);
        res.json(insights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get failure analytics
router.get("/:id/analytics", async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);
        if (!hackathon) {
            return res.status(404).json({ error: "Hackathon not found" });
        }

        // Calculate analytics by category
        const byCategory = hackathon.failures.reduce((acc, failure) => {
            const existing = acc.find(item => item.category === failure.category);
            if (existing) {
                existing.count++;
            } else {
                acc.push({ category: failure.category, count: 1 });
            }
            return acc;
        }, []);

        // Calculate analytics by phase
        const byPhase = hackathon.failures.reduce((acc, failure) => {
            const existing = acc.find(item => item.phase === failure.phase);
            if (existing) {
                existing.count++;
            } else {
                acc.push({ phase: failure.phase, count: 1 });
            }
            return acc;
        }, []);

        res.json({ byCategory, byPhase });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
