const dotenv = require("dotenv");
dotenv.config();

const app = require("./app/app");
const connectDB = require("./app/config/db");

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});