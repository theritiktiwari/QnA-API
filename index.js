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

app.get("/", (req, res) => {
    res.send("CracKube : Q&A API");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/questions", require("./routes/questions"));
app.use("/api/answers", require("./routes/answers"));

app.listen(port, () => {
    console.log(`Server running`);
});

module.exports = app;