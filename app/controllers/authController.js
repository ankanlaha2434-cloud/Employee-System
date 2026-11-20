
const Admin = require("../models/Admin");
const Employee = require("../models/Employee");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= CREATE ADMIN =================
const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: "Admin already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ================= ADMIN LOGIN =================
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                role: admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Admin login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ================= EMPLOYEE LOGIN =================
const employeeLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const employee = await Employee.findOne({ email });

        if (!employee || employee.role !== "employee") {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!employee.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is deactivated"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            employee.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: employee._id,
                employeeId: employee.employeeId,
                role: employee.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        employee.lastLogin = new Date();
        await employee.save();

        res.status(200).json({
            success: true,
            message: employee.isFirstLogin
                ? "Login successful. Please change your password."
                : "Login successful",
            token,
            isFirstLogin: employee.isFirstLogin,
            employee: {
                employeeId: employee.employeeId,
                name: employee.name,
                email: employee.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ================= CHANGE EMPLOYEE PASSWORD =================
const changeEmployeePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old Password and New Password are required"
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters"
            });
        }

        const employee = await Employee.findById(req.user.id);

        if (!employee || employee.role !== "employee") {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        const isMatch = await bcrypt.compare(
            oldPassword,
            employee.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        employee.password = await bcrypt.hash(newPassword, 10);
        employee.isFirstLogin = false;

        await employee.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
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
    createAdmin,
    adminLogin,
    employeeLogin,
    changeEmployeePassword
};
