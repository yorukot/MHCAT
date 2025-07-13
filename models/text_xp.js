const mongoose = require('mongoose');

const text_xp = new mongoose.Schema({
    guild: String,
    member: String,
    xp: String,
    leavel: String,
});

module.exports = new mongoose.model('text_xp', text_xp)