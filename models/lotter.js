const mongoose = require('mongoose');

const lotter = new mongoose.Schema({
    guild: String,
    date: String,
    gift: String,
    howmanywinner: String,
    id: String,
    member: Array,
    end: Boolean,
    message_channel: String,
    guild_new: Array,
    yesrole: String,
    norole: String,
    maxNumber: String,
    owner: String,
});

module.exports = new mongoose.model('lotter', lotter)