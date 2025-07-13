const mongoose = require('mongoose');

const voice_xp = new mongoose.Schema({
    guild: String,
    member: String,
    xp: String,
    leavel: String,
    leavejoin: String,
});

module.exports = new mongoose.model('voice_xp', voice_xp)