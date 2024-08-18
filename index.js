const express = require("express");
const connectDB = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");

const kycRoutes = require('./routes/kycRoutes');
const userRoutes = require('./routes/userRoutes');
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const app = express();

app.use(express.json());

// app.use(express.static('public'));
app.use(bodyParser.json());

app.use(
    cors({
        origin: [
            "http://localhost:3000",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

connectDB();

app.get("/", (req, res) => res.send(`<h1>Server is Working.</h1>`));

app.use('/api/kyc', kycRoutes);
app.use('/api/user', userRoutes);


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
});
