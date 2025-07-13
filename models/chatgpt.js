const mongoose = require('mongoose');

const chatgpt = new mongoose.Schema({
    guild: String,
    resid_c: String,
    resid_p: String,
    reply: Boolean,
    message: String,
    time: Number
});

module.exports = new mongoose.model('chatgpt', chatgpt)