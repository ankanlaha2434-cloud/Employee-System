
const express = require("express");
const router = express.Router();

const {
    createAdmin,
    adminLogin,
    employeeLogin,
    changeEmployeePassword
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

// CREATE ADMIN
router.post("/create-admin", createAdmin);

// ADMIN LOGIN
router.post("/admin-login", adminLogin);

// EMPLOYEE LOGIN
router.post("/employee-login", employeeLogin);

// EMPLOYEE CHANGE PASSWORD
router.post(
    "/employee/change-password",
    authMiddleware,
    changeEmployeePassword
);

module.exports = router;
