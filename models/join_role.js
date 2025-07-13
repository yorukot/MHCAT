const mongoose = require('mongoose');

const join_role = new mongoose.Schema({
    guild: String,
    role: String,
    give_to_who: String,
});

module.exports = new mongoose.model('join_role', join_role)