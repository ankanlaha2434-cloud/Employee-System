const crypto = require("crypto");

const generatePassword = () => {
    return crypto.randomBytes(6).toString("hex");
};

module.exports = generatePassword;