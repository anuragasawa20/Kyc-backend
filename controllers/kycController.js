const KYC = require('../models/kycModel');

exports.submitKYC = async (req, res) => {
    try {
        const { fullName, dateOfBirth, address, phone, email, idType, idNumber } = req.body;

        const newKYC = new KYC({
            fullName,
            dateOfBirth,
            address,
            phone,
            email,
            idType,
            idNumber,
            status: 'Pending'
        });

        await newKYC.save();

        res.status(201).json({ message: 'KYC submitted successfully', kycId: newKYC._id });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting KYC', error: error.message });
    }
};

exports.getKYCStatus = async (req, res) => {
    try {
        const kyc = await KYC.findById(req.params.userId);
        if (!kyc) {
            return res.status(404).json({ message: 'KYC not found' });
        }
        res.json({ status: kyc.status });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching KYC status', error: error.message });
    }
};

exports.getPendingKYC = async (req, res) => {
    try {
        const pendingKYCs = await KYC.find({ status: 'Pending' }).select('fullName submissionDate');
        res.json(pendingKYCs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending KYCs', error: error.message });
    }
};

exports.verifyKYC = async (req, res) => {
    try {
        const { kycId, decision, rejectionReason } = req.body;

        const kyc = await KYC.findById(kycId);
        if (!kyc) {
            return res.status(404).json({ message: 'KYC not found' });
        }

        kyc.status = decision === 'APPROVE' ? 'Approved' : 'Rejected';
        kyc.rejectionReason = rejectionReason;
        kyc.verificationDate = Date.now();

        await kyc.save();

        res.json({ message: 'KYC verified successfully', status: kyc.status });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying KYC', error: error.message });
    }
};