const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const { body, validationResult } = require('express-validator');

const User = require('../model/users');
const fetchUser = require("../middleware/fetchUser");

// ROUTE 1 - Create a user with endpoint (POST : '/auth/newuser').
router.post("/newuser", [
    body('name', "Name should not be less than 3 characters.").isLength({ min: 3 }),
    body('email', "Enter a valid email address.").isEmail(),
    body('password', "Password should not be less than 8 characters.").isLength({ min: 8 })
], async (req, res) => {

    // Return bad requests for errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            type: "error",
            message: error.array()
        });
    }

    const { name, email, password, confirmPassword } = req.body;
    try {
        if (password !== confirmPassword)
            return res.status(400).json({
                type: "error",
                message: "Password does not match."
            });

        let existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(409).json({
                type: "error",
                message: "Email already used."
            });

        // Send value in Database
        const user = await User.create({
            name,
            email,
            password: CryptoJS.AES.encrypt(password, process.env.CRYPTOJS_SECRET_KEY).toString()
        });

        if (user.id)
            return res.status(200).json({
                type: "success",
                message: "Account created successfully.",
            });

    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// ROUTE 2 - Authenticate a user with endpoint (POST : '/auth/login')
router.post('/login', [
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Password should not be blank").exists()
], async (req, res) => {
    // Return bad requests for errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            type: "error",
            message: error.array()
        });
    }

    const { email, password } = req.body;
    try {
        // Check if the user exist or not
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                type: "error",
                message: "Invalid Credentials."
            });
        }

        // Check if the password is correct or not
        let pass = CryptoJS.AES.decrypt(user.password, process.env.CRYPTOJS_SECRET_KEY);
        let decryptedPassword = pass.toString(CryptoJS.enc.Utf8);

        if (password !== decryptedPassword) {
            return res.status(400).json({
                type: "error",
                message: "Invalid Credentials."
            });
        }

        // Create a token and send it to user
        const user_data = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
        const authToken = jwt.sign(user_data, process.env.JWT_SECRET_KEY);
        res.status(200).json({
            type: "success",
            message: "Loggedin successfully.",
            data: authToken
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 3 - Get loggedin user details with endpoint (POST : '/auth/getuser')
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        // Get user details
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json({
            type: "success",
            message: "User details fetched successfully.",
            data: user
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 4 - Get all user details with endpoint (POST : '/auth/users') - Only for admin
router.post('/users', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const users = await User.find();
        if (users.length === 0)
            return res.status(200).json({
                type: "success",
                message: "No users found.",
                data: []
            });

        return res.status(200).json({
            type: "success",
            message: "User details fetched successfully.",
            data: users
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 5 - Get the user details from ID with endpoint (POST : '/auth/user/:id') - Only for admin
router.post('/user/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).json({
                type: "error",
                message: "User not found."
            });

        res.status(200).json({
            type: "success",
            message: "User details fetched successfully.",
            data: user
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 6 - Update the user details with endpoint (PUT : '/auth/update/:id')
router.put('/update/:id', fetchUser, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (name && name.length < 3)
            return res.status(400).json({
                type: "error",
                message: "Name should be more than 3 characters."
            });

        if (password && password.length < 8)
            return res.status(400).json({
                type: "error",
                message: "Password should be more than 8 characters."
            });

        const existingUser = await User.findById(req.params.id);
        if (!existingUser)
            return res.status(404).json({
                type: "error",
                message: "User not found."
            });

        const hashPass = CryptoJS.AES.encrypt(password, process.env.CRYPTOJS_SECRET_KEY).toString();

        let user;
        if (req.user.role === "admin") {
            user = await User.findByIdAndUpdate(req.params.id, {
                name: name ? name : existingUser.name,
                email: email ? email : existingUser.email,
                password: password ? hashPass : existingUser.password,
                role: role ? role : existingUser.role
            }, { new: true });
        } else {
            // Check if the user is updating his own details
            if (req.user.id !== req.params.id)
                return res.status(401).json({
                    type: "error",
                    message: "You are not authorized to perform this action."
                });

            // If updating email or role, then return error
            if (email || role)
                return res.status(401).json({
                    type: "error",
                    message: "You are not authorized to perform this action."
                });

            user = await User.findByIdAndUpdate(req.params.id, {
                name: name ? name : existingUser.name,
                password: password ? hashPass : existingUser.password,
            }, { new: true });
        }

        if (!user)
            return res.status(404).json({
                type: "error",
                message: "User not found."
            });

        res.status(200).json({
            type: "success",
            message: "User details updated successfully.",
            data: user
        });

    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 7 - Delete the user details with endpoint (DELETE : '/auth/delete/:id') - Only for admin
router.delete('/delete/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        let user = await User.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).json({
                type: "error",
                message: "User not found."
            });

        res.status(200).json({
            type: "success",
            message: "User details deleted successfully."
        });

    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

module.exports = router;