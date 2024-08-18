const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

exports.verifyBankOfficial = async (req, res, next) => {
    if (req.user.role !== 'bank_official') {
        return res.status(403).json({ message: 'Access denied. Bank official role required.' });
    }
    next();
};