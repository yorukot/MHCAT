const mongoose = require('mongoose');

const chat = new mongoose.Schema({
    guild: String,
    channel: String,
});

module.exports = new mongoose.model('chat', chat)