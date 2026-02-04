const mongoose = require("mongoose");

const TeamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Frontend', 'Backend', 'Fullstack', 'Design', 'Mobile', 'Lead'],
        default: 'Fullstack'
    },
    status: {
        type: String,
        enum: ['Coding', 'Debugging', 'Designing', 'Resting', 'Panic'],
        default: 'Coding'
    },
    avatar: String
});

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['todo', 'doing', 'done'],
        default: 'todo'
    },
    assignee: String
});

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    hackathonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon',
        required: true
    },
    members: [TeamMemberSchema],
    tasks: [TaskSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Team", TeamSchema);
