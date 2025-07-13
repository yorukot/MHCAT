const mongoose = require('mongoose');

const leave_message = new mongoose.Schema({
    guild: String,
    message_content: String,
    title: String,
    color: String,
    channel: String,
});

module.exports = new mongoose.model('leave_message', leave_message)