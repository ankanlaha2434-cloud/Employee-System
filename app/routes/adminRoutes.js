const express = require("express");
const router = express.Router();

const {
    createEmployee,
    getEmployees,
    updateEmployeeStatus,
    resetEmployeePassword
} = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// CREATE EMPLOYEE
router.post(
    "/create-employee",
    authMiddleware,
    roleMiddleware("admin"),
    createEmployee
);

// GET ALL EMPLOYEES
router.get(
    "/employees",
    authMiddleware,
    roleMiddleware("admin"),
    getEmployees
);

// UPDATE EMPLOYEE STATUS
router.patch(
    "/employee/:id/status",
    authMiddleware,
    roleMiddleware("admin"),
    updateEmployeeStatus
);

// RESET EMPLOYEE PASSWORD
router.post(
    "/reset-password/:id",
    authMiddleware,
    roleMiddleware("admin"),
    resetEmployeePassword
);

module.exports = router;
