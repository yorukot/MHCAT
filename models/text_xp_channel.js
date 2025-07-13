const mongoose = require('mongoose');

const text_xp_channel = new mongoose.Schema({
    guild: String,
    channel: String,
    background: String,
    color: String,
    message: String,
});

module.exports = new mongoose.model('text_xp_channel', text_xp_channel)