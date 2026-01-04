const mongoose = require("mongoose");

const FailureSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Scope', 'Time', 'Tech', 'Focus', 'Team'],
        required: true
    },
    phase: {
        type: String,
        enum: ['Early', 'Mid', 'Final Hours'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    severity: {
        type: Number,
        default: 5,
        min: 1,
        max: 10
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const HackathonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    teamSize: {
        type: Number,
        required: true
    },
    plannedFeatures: {
        type: Number,
        required: true,
        default: 0
    },
    completedFeatures: {
        type: Number,
        required: true,
        default: 0
    },
    riskScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    riskiestPhase: {
        type: String,
        enum: ['Early', 'Mid', 'Final Hours'],
        default: 'Final Hours'
    },
    failures: [FailureSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Hackathon", HackathonSchema);
