// const express = require("express");
// const connectDB = require("./db");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { auth, resolver, protocol } = require("@iden3/js-iden3-auth");
// const getRawBody = require("raw-body");
// const { createIssuerDid } = require('./create-issuer-did');
// const { v4: uuidv4 } = require('uuid');
// const qrcode = require('qrcode');
// const { createVerifiableCredentialJwt } = require('did-jwt-vc');
// const kycRoutes = require('./routes/kycRoutes');
// const userRoutes = require('./routes/userRoutes');
// const { generateVerificationQR } = require('./generate-polygon-id-qr');

// // cloudinary.config({
// //     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //     api_key: process.env.CLOUDINARY_API_KEY,
// //     api_secret: process.env.CLOUDINARY_API_SECRET,
// // });

// const app = express();

// app.use(express.json());

// // app.use(express.static('public'));
// app.use(bodyParser.json());

// app.use(
//     cors({
//         origin: [
//             "http://localhost:3000",
//         ],
//         credentials: true,
//         methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//         allowedHeaders: ["Content-Type", "Authorization"],
//     })
// );

// //connectDB();

// app.get("/", (req, res) => res.send(`<h1>Server is Working.</h1>`));

// app.use('/api/kyc', kycRoutes);
// app.use('/api/user', userRoutes);



// const issuerInfo = createIssuerDid();
// console.log('Issuer DID created:', issuerInfo.did);

// async function generateUserCredential(userInfo) {
//     const { name, gender, age, aadharNumber } = userInfo;

//     const vcPayload = {
//         '@context': ['https://www.w3.org/2018/credentials/v1'],
//         type: ['VerifiableCredential', 'UserInfoCredential'],
//         credentialSubject: {
//             id: `did:polygonid:${uuidv4()}`, // Generate a new DID for the user
//             name,
//             gender,
//             age,
//             aadharNumber
//         }
//     };

//     const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuerInfo);
//     return vcJwt;
// }

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
//                 url: `https://3749-2401-4900-1c1a-4a4d-c042-cd1d-2be7-4774.ngrok-free.app/api/claim-credential`,
//                 credentials: [{
//                     id: '1',
//                     description: 'User Info Credential',
//                 }],
//             },
//             from: issuerInfo.did,
//             to: credential.credentialSubject.id,
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

// app.post('/api/claim-credential', (req, res) => {
//     // This endpoint would be called by the Polygon ID wallet
//     // Here you would typically fetch the credential based on the request
//     // and return it to the wallet

//     // For this example, we're just sending a success message
//     res.json({ message: 'Credential issued successfully' });
// });







// const sessions = new Map();

// app.get('/generate-verification-qr', async (req, res) => {
//     try {
//         const { sessionId, qrCode } = await generateVerificationQR();
//         sessions.set(sessionId, { status: 'pending' });
//         res.json({ sessionId, qrCode });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.post('/callback/:sessionId', async (req, res) => {
//     const { sessionId } = req.params;
//     const authResponse = req.body;

//     try {
//         // Verify the proof
//         const ethURL = 'https://polygon-mumbai.g.alchemy.com/v2/YOUR-API-KEY';
//         const verificationResult = await auth.verifyAuthResponse(authResponse, {
//             acceptedStateTransitionDelay: 5 * 60 * 1000, // 5 minutes
//             acceptedProofGenerationDelay: 5 * 60 * 1000, // 5 minutes
//             ethNodeUrl: ethURL
//         });

//         if (verificationResult.verified) {
//             sessions.set(sessionId, { status: 'verified' });
//             res.status(200).json({ message: 'Proof verified successfully' });
//         } else {
//             sessions.set(sessionId, { status: 'failed' });
//             res.status(400).json({ error: 'Proof verification failed' });
//         }
//     } catch (error) {
//         sessions.set(sessionId, { status: 'error', message: error.message });
//         res.status(500).json({ error: error.message });
//     }
// });




// app.get("/api/sign-in", (req, res) => {
//     console.log("get Auth Request");
//     getAuthRequest(req, res);
// });

// app.post("/api/callback", (req, res) => {
//     console.log("callback");
//     callback(req, res);
// });



// const requestMap = new Map();

// async function getAuthRequest(req, res) {
//     // Audience is verifier id
//     const hostUrl = "http://localhost:8080/";
//     const sessionId = 1;
//     const callbackURL = "/api/callback";
//     const audience =
//         "did:polygonid:polygon:amoy:2qQ68JkRcf3xrHPQPWZei3YeVzHPP58wYNxx2mEouR";

//     const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;

//     // Generate request for basic authentication
//     const request = auth.createAuthorizationRequest("test flow", audience, uri);

//     request.id = "7f38a193-0918-4a48-9fac-36adfdb8b542";
//     request.thid = "7f38a193-0918-4a48-9fac-36adfdb8b542";

//     // Add request for a specific proof
//     const proofRequest = {
//         id: 1,
//         circuitId: "credentialAtomicQuerySigV2",
//         query: {
//             allowedIssuers: ["*"],
//             type: "KYCAgeCredential",
//             context:
//                 "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld",
//             credentialSubject: {
//                 birthday: {
//                     $lt: 20000101,
//                 },
//             },
//         },
//     };
//     const scope = request.body.scope ?? [];
//     request.body.scope = [...scope, proofRequest];

//     // Store auth request in map associated with session ID
//     requestMap.set(`${sessionId}`, request);

//     return res.status(200).set("Content-Type", "application/json").send(request);
// }

// // Callback verifies the proof after sign-in callbacks
// async function callback(req, res) {
//     // Get session ID from request
//     const sessionId = req.query.sessionId;

//     // get JWZ token params from the post request
//     const raw = await getRawBody(req);
//     const tokenStr = raw.toString().trim();
//     console.log(tokenStr);

//     const ethURL = "<AMOY_URL>";
//     const contractAddress = "0x1a4cC30f2aA0377b0c3bc9848766D90cb4404124";
//     const keyDIR = "../keys";

//     const ethStateResolver = new resolver.EthStateResolver(
//         ethURL,
//         contractAddress
//     );

//     const resolvers = {
//         ["polygon:amoy"]: ethStateResolver,
//     };

//     // fetch authRequest from sessionID
//     const authRequest = requestMap.get(`${sessionId}`);

//     // EXECUTE VERIFICATION
//     const verifier = await auth.Verifier.newVerifier({
//         stateResolver: resolvers,
//         circuitsDir: path.join(__dirname, keyDIR),
//         ipfsGatewayURL: "https://ipfs.io",
//     });

//     try {
//         const opts = {
//             AcceptedStateTransitionDelay: 5 * 60 * 1000, // 5 minute
//         };
//         authResponse = await verifier.fullVerify(tokenStr, authRequest, opts);
//     } catch (error) {
//         return res.status(500).send(error);
//     }
//     return res
//         .status(200)
//         .set("Content-Type", "application/json")
//         .send(authResponse);
// }

// const port = process.env.PORT || 5000;

// app.listen(port, () => {
//     console.log(`app is listening on port ${port}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const qrcode = require('qrcode');
const crypto = require('crypto');
const { auth, resolver, loaders } = require("@iden3/js-iden3-auth");
const getRawBody = require("raw-body");
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const issueRoutes = require('./routes/issueRoutes');
const { AadharCardSchema } = require('./aadharCardSchema');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());


const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

app.use('/issue', issueRoutes);

const authRequests = new Map();

// Placeholder VERIFIER_DID - replace this with your actual DID when you have one
const VERIFIER_DID = process.env.VERIFIER_DID || "did:polygonid:polygon:amoy:2qVQhnN8cTvWLGgdWkCjrLRsV3ZEdBtRA6MjV7NM7z";

const apiPath = {
    getAuthQr: "/api/get-auth-qr",
    handleVerification: "/api/verification-callback",
    checkStatus: "/api/check-verification-status",
};

function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

app.get("/", (req, res) => {
    res.send(`Welcome to your backend Polygon ID verifier server! Available routes: ${Object.values(apiPath).join(", ")}.`);
});


app.use(express.static("../static"));

app.get("/api/sign-in", (req, res) => {
    console.log("get Auth Request");
    getAuthRequest(req, res);
});

app.post("/api/callback", (req, res) => {
    console.log("callback");
    callback(req, res);
});

// Create a map to store the auth requests and their session IDs
const requestMap = new Map();

// GetQR returns auth request
async function getAuthRequest(req, res) {
    // Audience is verifier id
    const hostUrl = "https://7e94-2401-4900-1c1b-9bf6-3d40-6fa2-bb80-b978.ngrok-free.app";
    const sessionId = 1;
    const callbackURL = "/api/callback";
    const audience =
        "did:polygonid:polygon:amoy:2qV9QXdhXXmN5sKjN1YueMjxgRbnJcEGK2kGpvk3cq";

    const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;

    // Generate request for basic authentication
    const request = auth.createAuthorizationRequest("test flow", audience, uri);

    request.id = "7f38a193-0918-4a48-9fac-36adfdb8b542";
    request.thid = "7f38a193-0918-4a48-9fac-36adfdb8b542";

    // Add request for a specific proof
    const proofRequest = {
        "circuitId": "credentialAtomicQuerySigV2",
        "id": 1724324637,
        "query": {
            "allowedIssuers": [
                "*"
            ],
            "context": "ipfs://QmaNKpHUyuTdpN2EmFHyY7Puyr4DSwSNk16w9mi9rv9TJQ",
            "type": "KYC",
            "credentialSubject": {
                "name": {
                    "$eq": "Anurag"
                },
                "phone_number": {
                    "$eq": 9999999999
                }
            }
        }
    };
    const scope = request.body.scope ?? [];
    request.body.scope = [...scope, proofRequest];

    // Store auth request in map associated with session ID
    requestMap.set(`${sessionId}`, request);

    return res.status(200).set("Content-Type", "application/json").send(request);
}

// Callback verifies the proof after sign-in callbacks
async function callback(req, res) {
    // Get session ID from request
    const sessionId = req.query.sessionId;

    // get JWZ token params from the post request
    const raw = await getRawBody(req);
    const tokenStr = raw.toString().trim();
    //console.log(tokenStr);

    const ethURL = "https://rpc-amoy.polygon.technology/";
    const contractAddress = "0x1a4cC30f2aA0377b0c3bc9848766D90cb4404124";
    const keyDIR = "./keys";

    const ethStateResolver = new resolver.EthStateResolver(
        ethURL,
        contractAddress
    );

    const resolvers = {
        ["polygon:amoy"]: ethStateResolver,
    };

    // fetch authRequest from sessionID
    const authRequest = requestMap.get(`${sessionId}`);

    // EXECUTE VERIFICATION
    const verifier = await auth.Verifier.newVerifier({
        stateResolver: resolvers,
        circuitsDir: path.join(__dirname, keyDIR),
        ipfsGatewayURL: "https://ipfs.io",
    });
    console.log(verifier);
    try {
        const opts = {
            AcceptedStateTransitionDelay: 5 * 60 * 1000, // 5 minute
        };
        authResponse = await verifier.fullVerify(tokenStr, authRequest, opts);
        console.log(authResponse);
    } catch (error) {
        return res.status(500).send(error);
    }

    return res
        .status(200)
        .set("Content-Type", "application/json")
        .send(authResponse);
}


app.post('/api/issue-credential', async (req, res) => {
    try {
        const userInfo = req.body;

        // Validate user info
        if (!userInfo.name || !userInfo.gender || !userInfo.age || !userInfo.aadharNumber) {
            return res.status(400).json({ error: 'Missing required user information' });
        }

        // Generate the credential
        const credential = await generateUserCredential(userInfo);

        // Create a credential offer
        const offer = {
            type: 'https://iden3-communication.io/credentials/1.0/offer',
            body: {
                url: `${BACKEND_URL}/api/claim-credential`,
                credentials: [{
                    id: '1',
                    description: 'User Info Credential',
                }],
            },
            from: issuerInfo.did.did,
            to: `did:polygonid:${uuidv4()}`, // Generate a new DID for the user
            thid: uuidv4(),
        };

        // Generate QR code
        const qrCodeData = JSON.stringify(offer);
        const qrCodeBuffer = await qrcode.toBuffer(qrCodeData);

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename="credential-offer.png"');
        res.send(qrCodeBuffer);
    } catch (error) {
        console.error('Error issuing credential:', error);
        res.status(500).json({ error: 'Failed to issue credential' });
    }
});

app.post('/api/claim-credential', async (req, res) => {
    try {
        // In a real implementation, you would fetch the user info based on the request
        // For this example, we're using dummy data
        const userInfo = {
            name: "John Doe",
            gender: "Male",
            age: 30,
            aadharNumber: "1234 5678 9012"
        };

        const credential = await generateUserCredential(userInfo);
        res.json({ credential });
    } catch (error) {
        console.error('Error claiming credential:', error);
        res.status(500).json({ error: 'Failed to claim credential' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;