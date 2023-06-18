const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
connectDB();

app.get("/api", (req, res) => {
    console.log({dev: process.env.NODE_ENV});
    res.send("CracKube : Q&A API");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/questions", require("./routes/questions"));

app.listen(port, () => {
    console.log(`Server running`);
});

module.exports = app;