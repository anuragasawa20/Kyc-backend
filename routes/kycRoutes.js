const express = require('express');
const kycController = require('../controllers/kycController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/submit', kycController.submitKYC);
router.get('/status/:userId', kycController.getKYCStatus);
router.get('/pending', auth.verifyBankOfficial, kycController.getPendingKYC);
router.post('/verify', auth.verifyBankOfficial, kycController.verifyKYC);

module.exports = router;