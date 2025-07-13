const mongoose = require('mongoose');

const role_number = new mongoose.Schema({
    guild: String,
    channel: String,
    channel_name: String,
    role: String,
});

module.exports = new mongoose.model('role_number', role_number)