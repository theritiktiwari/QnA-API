const express = require("express");
const router = express.Router();

const Answer = require('../model/answers');
const fetchUser = require("../middleware/fetchUser");

// Route 1 - Create a new answer data with endpoint (POST : '/answers')
router.post('/', fetchUser, async (req, res) => {
    try {
        const { title, Answer_id } = req.body;

        if (!title || !Answer_id)
            return res.status(400).json({
                type: "error",
                message: "Please fill all the fields."
            });

        const item = await Answer.create({
            title,
            Answer_id,
            user_id: req.user.id
        });

        res.status(200).json({
            type: "success",
            message: "Answer added successfully",
            data: item
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// Route 2 - Get all answers data with endpoint (GET : '/answers')
router.get('/', async (req, res) => {
    try {
        const item = await Answer.find();

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

// Route 3 - Get own answers data with endpoint (GET : '/answers/my')
router.get('/my', fetchUser, async (req, res) => {
    try {
        const item = await Answer.find({ user_id: req.user.id });

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

// ROUTE 4 - Update the answers data with endpoint (PUT : '/answers/:id')
router.put('/:id', fetchUser, async (req, res) => {
    try {
        const { title } = req.body;

        if (!title)
            return res.status(400).json({
                type: "error",
                message: "Please fill all the fields."
            });

        const existingAnswer = await Answer.findById(req.params.id);
        if (!existingAnswer)
            return res.status(404).json({
                type: "error",
                message: "Answer not found."
            });

        if (req.user.role !== "admin")
            if (existingAnswer.user_id !== req.user.id)
                return res.status(401).json({
                    type: "error",
                    message: "You are not authorized to perform this action."
                });

        const item = await Answer.findByIdAndUpdate(req.params.id, {
            title: title || existingAnswer.title
        }, { new: true });

        return res.status(200).json({
            type: "success",
            message: "Answer updated successfully.",
            data: item
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 5 - Delete the answers data with endpoint (DELETE : '/answers/:id')
router.delete('/:id', fetchUser, async (req, res) => {
    try {
        const existingAnswer = await Answer.findById(req.params.id);
        if (!existingAnswer)
            return res.status(404).json({
                type: "error",
                message: "Answer not found."
            });

        if (req.user.role !== "admin")
            if (existingAnswer.user_id !== req.user.id)
                return res.status(401).json({
                    type: "error",
                    message: "You are not authorized to perform this action."
                });

        const item = await Answer.findByIdAndDelete(req.params.id);
        if (!item)
            return res.status(404).json({
                type: "error",
                message: "Answer not found."
            });

        return res.status(200).json({
            type: "success",
            message: "Answer deleted successfully."
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

module.exports = router;