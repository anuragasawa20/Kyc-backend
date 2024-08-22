const qrcode = require('qrcode');
const axios = require('axios');
const express = require('express');
const router = express.Router();

const POLYGON_ID_BASE_URL = 'https://self-hosted-platform.polygonid.me/v1';
const AUTH_TOKEN = 'Basic dXNlci1pc3N1ZXI6cGFzc3dvcmQtaXNzdWVy'; // Replace with your actual token

// Utility function for making authenticated requests
async function makeAuthenticatedRequest(method, url, data = null) {
    try {
        const response = await axios({
            method,
            url: `${POLYGON_ID_BASE_URL}${url}`,
            headers: {
                'Authorization': AUTH_TOKEN,
                'Content-Type': 'routerlication/json'
            },
            data
        });
        return response.data;
    } catch (error) {
        console.log(error);
        console.error('Error making request:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Step 1: Create Identity
router.post('/create-identity', async (req, res) => {
    try {
        const identityData = {
            didMetadata: {
                method: "polygonid",
                blockchain: "polygon",
                network: "amoy",
                type: "BJJ"
            }
        };
        const identity = await makeAuthenticatedRequest('post', '/identities', identityData);
        res.json({ message: 'Identity created', identity });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create identity' });
    }
});

// Step 2: Issue Claim
router.post('/issue-claim', async (req, res) => {
    try {
        const { identifier, credentialSubject } = req.body;
        const claimData = {
            credentialSchema: "https://raw.githubusercontent.com/anuragasawa20/Kyc-backend/main/aadhar-kyc.json",
            type: "KYC",
            credentialSubject
        };
        const claim = await makeAuthenticatedRequest('post', `/${identifier}/claims`, claimData);
        res.json({ message: 'Claim issued', claim });
    } catch (error) {
        res.status(500).json({ error: 'Failed to issue claim' });
    }
});

// Step 3: Generate QR Code
router.get('/generate-qr/:identifier/:claimId', async (req, res) => {
    try {
        const { identifier, claimId } = req.params;
        const qrCodeData = await makeAuthenticatedRequest('get', `/${identifier}/claims/${claimId}/qrcode`);
        console.log("qrCodeData", qrCodeData);
        const qrCodeImage = await qrcode.toDataURL(JSON.stringify(qrCodeData));
        res.json({ message: 'QR code generated', qrCodeImage });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

// Complete flow
router.post('/complete-flow', async (req, res) => {
    try {
        // Step 1: Create Identity
        const identityData = {
            didMetadata: {
                method: "polygonid",
                blockchain: "polygon",
                network: "amoy",
                type: "BJJ"
            }
        };
        const identity = await makeAuthenticatedRequest('post', '/identities', identityData);
        const identifier = identity.identifier;
        // console.log("identifier");
        // Step 2: Issue Claim
        const { credentialSchema, type, credentialSubject } = req.body;
        //  credentialSubject.id = userPolygonId;
        // const { aadhar_number, gender, name, phone_number } = req.body;
        const claimData = {
            credentialSchema: credentialSchema,
            type: type,
            credentialSubject: credentialSubject
        };
        //  console.log(claimData);
        const claim = await makeAuthenticatedRequest('post', `/${identifier}/claims`, claimData);
        console.log(claim);
        // Step 3: Generate QR Code
        const qrCodeData = await makeAuthenticatedRequest('get', `/${identifier}/claims/${claim.id}/qrcode`);
        // console.log("qrCodeData", qrCodeData);

        const qrCodeImage = await qrcode.toDataURL(JSON.stringify(qrCodeData));

        res.json({
            message: 'Complete flow executed successfully',
            identity,
            claim,
            qrCodeData,
            qrCodeImage
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to complete flow', details: error.message });
    }
});


module.exports = router