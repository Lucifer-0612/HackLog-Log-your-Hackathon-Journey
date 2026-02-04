const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String, // Emoji or URL
        required: true
    },
    category: {
        type: String,
        enum: ['Milestone', 'Skill', 'Endurance', 'Social'],
        required: true
    },
    criteria: String, // Description of how to get it
    isUnlocked: {
        type: Boolean,
        default: false
    },
    unlockedAt: Date
});

module.exports = mongoose.model("Badge", BadgeSchema);
