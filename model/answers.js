const mongoose = require('mongoose');
const { Schema } = mongoose;

const answerSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    question_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Answer = mongoose.model('answer', answerSchema);
module.exports = Answer;