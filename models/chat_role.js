const mongoose = require('mongoose');

const chat_role = new mongoose.Schema({
    guild: String,
    leavel: String,
    role: String,
    delete_when_not: Boolean,
});

module.exports = new mongoose.model('chat_role', chat_role)