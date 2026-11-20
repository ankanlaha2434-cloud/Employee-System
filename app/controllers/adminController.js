const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");

const generatePassword = require("../utils/generatePassword");

// ================= CREATE EMPLOYEE =================
const createEmployee = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and Email are required"
            });
        }

        const existingEmployee = await Employee.findOne({ email });

        if (existingEmployee) {
            return res.status(409).json({
                success: false,
                message: "Employee already exists"
            });
        }

        const temporaryPassword = generatePassword();

        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        const employeeId = "EMP" + Date.now();

        const employee = await Employee.create({
            employeeId,
            name,
            email,
            password: hashedPassword,
            role: "employee",
            isActive: true,
            isFirstLogin: true
        });

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            employee: {
                employeeId: employee.employeeId,
                name: employee.name,
                email: employee.email
            },
            temporaryPassword
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ================= GET ALL EMPLOYEES =================
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({ role: "employee" })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalEmployees: employees.length,
            employees
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ================= UPDATE EMPLOYEE STATUS =================
const updateEmployeeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false"
            });
        }

        const employee = await Employee.findByIdAndUpdate(
            id,
            { isActive },
            { new: true, runValidators: true }
        ).select("-password");

        if (!employee || employee.role !== "employee") {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Employee status updated successfully",
            employee
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ================= RESET EMPLOYEE PASSWORD =================
const resetEmployeePassword = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id);

        if (!employee || employee.role !== "employee") {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        const temporaryPassword = generatePassword();

        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        employee.password = hashedPassword;
        employee.isFirstLogin = true;

        await employee.save();

        res.status(200).json({
            success: true,
            message: "Employee password reset successfully",
            employee: {
                employeeId: employee.employeeId,
                name: employee.name,
                email: employee.email
            },
            temporaryPassword
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ================= EXPORT =================
module.exports = {
    createEmployee,
    getEmployees,
    updateEmployeeStatus,
    resetEmployeePassword
};
