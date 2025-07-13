const mongoose = require('mongoose');

const guild = new mongoose.Schema({
    guild: String,
    announcement_id: String,
    voice_detection: String
});

module.exports = new mongoose.model('guild', guild)