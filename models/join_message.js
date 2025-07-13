const mongoose = require('mongoose');

const join_message = new mongoose.Schema({
    guild: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    enable: {
        type: mongoose.SchemaTypes.Boolean,
        required: true,
        unique: true,
    },
    message_content: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    color: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    channel: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    img: {
        type: mongoose.SchemaTypes.String,
    },
});

module.exports = new mongoose.model('join_message', join_message)