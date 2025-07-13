const mongoose = require('mongoose');

const voice_channel_id = new mongoose.Schema({
    guild: String,
    channel_id: String,
});

module.exports = new mongoose.model('voice_channel_id', voice_channel_id)