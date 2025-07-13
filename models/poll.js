const mongoose = require('mongoose');

const poll = new mongoose.Schema({
    guild: String,
    messageid: String,
    question: String,
    create_member_id: String,
    many_choose: Number,
    can_change_choose: Boolean,
    can_see_result: Boolean,
    end: Boolean,
    anonymous: Boolean,
    choose_data: Array,
    join_member: Array,
});

module.exports = new mongoose.model('poll', poll)