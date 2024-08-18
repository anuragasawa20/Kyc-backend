const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    idType: { type: String, required: true },
    idNumber: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    submissionDate: { type: Date, default: Date.now },
    verificationDate: { type: Date },
    rejectionReason: { type: String }
});

module.exports = mongoose.model('KYC', kycSchema);