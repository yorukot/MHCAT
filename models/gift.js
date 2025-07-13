const mongoose = require('mongoose');

const gift = new mongoose.Schema({
    guild: String,
    gift_name: String,
    gift_code: String,
    gift_chence: Number,
    auto_delete: Boolean,
    gift_count: Number,
    give_coin: Number,
});

module.exports = new mongoose.model('gift', gift)