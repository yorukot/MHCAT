const mongoose = require('mongoose');

const ticket = new mongoose.Schema({
    guild: String,
    ticket_channel: String,
    admin_id: String,
    everyone_id: String,
});

module.exports = new mongoose.model('ticket', ticket)