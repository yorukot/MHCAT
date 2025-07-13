const mongoose = require('mongoose');

const message_reaction = new mongoose.Schema({
    guild: String,
    message: String,
    react: String,
    role: String,
});

module.exports = new mongoose.model('message_reaction', message_reaction)