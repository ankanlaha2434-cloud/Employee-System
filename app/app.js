const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Employee Management System Running Successfully");
});

module.exports = app;