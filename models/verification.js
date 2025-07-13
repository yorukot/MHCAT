const mongoose = require('mongoose');

const verification = new mongoose.Schema({
    guild: String,
    role: String,
    name: String,
});

module.exports = new mongoose.model('verification', verification)