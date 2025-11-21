const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
    alertId: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        default: 'Location unavailable'
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['New', 'Acknowledged', 'Resolved'],
        default: 'New'
    },
    notes: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('SOSAlert', sosAlertSchema);
