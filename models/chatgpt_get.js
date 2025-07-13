const mongoose = require('mongoose');

const chatgpt_get = new mongoose.Schema({
    guild: String,
    price: Number,
});

module.exports = new mongoose.model('chatgpt_get', chatgpt_get)