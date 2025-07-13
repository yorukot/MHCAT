const mongoose = require('mongoose');

const create_hours = new mongoose.Schema({
    guild: String,
    hours: String,
    channel: String,
});

module.exports = new mongoose.model('create_hours', create_hours)