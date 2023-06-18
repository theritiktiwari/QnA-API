const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    title: {
        type: String,
        required: true,
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

const Question = mongoose.model('question', questionSchema);
module.exports = Question;