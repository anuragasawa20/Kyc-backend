

// app.post('/api/issue-credential', async (req, res) => {
//     try {
//         const userInfo = req.body;

//         // Validate user info
//         if (!userInfo.name || !userInfo.gender || !userInfo.age || !userInfo.aadharNumber) {
//             return res.status(400).json({ error: 'Missing required user information' });
//         }

//         // Generate the credential
//         const credential = await generateUserCredential(userInfo);

//         // Create a credential offer
//         const offer = {
//             type: 'https://iden3-communication.io/credentials/1.0/offer',
//             body: {
//                 url: `${BACKEND_URL}/api/claim-credential`,
//                 credentials: [{
//                     id: '1',
//                     description: 'User Info Credential',
//                 }],
//             },
//             from: issuerInfo.did.did,
//             to: `did:polygonid:${uuidv4()}`, // Generate a new DID for the user
//             thid: uuidv4(),
//         };

//         // Generate QR code
//         const qrCodeData = JSON.stringify(offer);
//         const qrCodeBuffer = await qrcode.toBuffer(qrCodeData);

//         res.setHeader('Content-Type', 'image/png');
//         res.setHeader('Content-Disposition', 'attachment; filename="credential-offer.png"');
//         res.send(qrCodeBuffer);
//     } catch (error) {
//         console.error('Error issuing credential:', error);
//         res.status(500).json({ error: 'Failed to issue credential' });
//     }
// });

// app.post('/api/claim-credential', async (req, res) => {
//     try {
//         // In a real implementation, you would fetch the user info based on the request
//         // For this example, we're using dummy data
//         const userInfo = {
//             name: "John Doe",
//             gender: "Male",
//             age: 30,
//             aadharNumber: "1234 5678 9012"
//         };

//         const credential = await generateUserCredential(userInfo);
//         res.json({ credential });
//     } catch (error) {
//         console.error('Error claiming credential:', error);
//         res.status(500).json({ error: 'Failed to claim credential' });
//     }
// });

