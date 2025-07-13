const mongoose = require('mongoose');

const lock_channel = new mongoose.Schema({
    guild: String,
    channel_id: String,
    lock_anser: String,
    owner: String,
    text_channel: String,
    ok_people: Array,
});

module.exports = new mongoose.model('lock_channel', lock_channel)