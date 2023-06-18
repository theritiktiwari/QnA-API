const express = require("express");
const router = express.Router();

const Question = require('../model/questions');
const Answer = require('../model/answers');
const fetchUser = require("../middleware/fetchUser");

// Route 1 - Create a new question data with endpoint (POST : '/questions')
router.post('/', fetchUser, async (req, res) => {
    try {
        const { title } = req.body;

        if (!title)
            return res.status(400).json({
                type: "error",
                message: "Please fill all the fields."
            });

        const item = await Question.create({
            title,
            user_id: req.user.id
        });

        res.status(200).json({
            type: "success",
            message: "Question added successfully",
            data: item
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// Route 2 - Get all questions data with endpoint (GET : '/questions')
router.get('/', async (req, res) => {
    try {
        const item = await Question.find();

        if (item.length === 0)
            return res.status(200).json({
                type: "success",
                message: "No data found.",
                data: []
            });

        const page = parseInt(req.page) || 1;
        const limit = parseInt(req.limit) || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedItems = item.slice(startIndex, endIndex);

        return res.status(200).json({
            type: "success",
            message: "Data fetched successfully",
            data: {
                value: paginatedItems,
                pagination: {
                    page,
                    limit,
                    total: item.length
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// Route 3 - Get own questions data with endpoint (GET : '/questions/my')
router.get('/my', fetchUser, async (req, res) => {
    try {
        const item = await Question.find({ user_id: req.user.id });

        if (item.length === 0)
            return res.status(200).json({
                type: "success",
                message: "No data found.",
                data: []
            });

        return res.status(200).json({
            type: "success",
            message: "Data fetched successfully",
            data: item
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// ROUTE 4 - Update the questions data with endpoint (PUT : '/questions/:id')
router.put('/:id', fetchUser, async (req, res) => {
    try {
        const { title } = req.body;

        if (!title)
            return res.status(400).json({
                type: "error",
                message: "Please fill all the fields."
            });

        const existingQuestion = await Question.findById(req.params.id);
        if (!existingQuestion)
            return res.status(404).json({
                type: "error",
                message: "Question not found."
            });

        if (req.user.role !== "admin")
            if (existingQuestion.user_id !== req.user.id)
                return res.status(401).json({
                    type: "error",
                    message: "You are not authorized to perform this action."
                });

        const item = await Question.findByIdAndUpdate(req.params.id, {
            title: title || existingQuestion.title
        }, { new: true });

        return res.status(200).json({
            type: "success",
            message: "Question updated successfully.",
            data: item
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 5 - Delete the questions data with endpoint (DELETE : '/questions/:id')
router.delete('/:id', fetchUser, async (req, res) => {
    try {
        const existingQuestion = await Question.findById(req.params.id);
        if (!existingQuestion)
            return res.status(404).json({
                type: "error",
                message: "Question not found."
            });

        if (req.user.role !== "admin")
            if (existingQuestion.user_id !== req.user.id)
                return res.status(401).json({
                    type: "error",
                    message: "You are not authorized to perform this action."
                });

        const answer = await Answer.deleteMany({ question_id: req.params.id });
        const question = await Question.findByIdAndDelete(req.params.id);

        if (question && answer)
            return res.status(200).json({
                type: "success",
                message: "Question deleted successfully."
            });

    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

module.exports = router;