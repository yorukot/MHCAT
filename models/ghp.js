const mongoose = require('mongoose');

const ghp = new mongoose.Schema({
    guild: String,
    commodity_id: Number,
    name: String,
    need_coin: String,
    commodity_description: String,
    code: String,
    auto_delete: Boolean,
    role: String,
    commodity_count: Number,
});

module.exports = new mongoose.model('ghp', ghp)