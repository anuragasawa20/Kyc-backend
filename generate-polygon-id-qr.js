const qrcode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

async function generateVerificationQR(sessionId = uuidv4()) {
    const verificationRequest = {
        id: sessionId,
        typ: 'application/iden3comm-plain-json',
        type: 'https://iden3-communication.io/authorization/1.0/request',
        thid: sessionId,
        body: {
            callbackUrl: `https://3749-2401-4900-1c1a-4a4d-c042-cd1d-2be7-4774.ngrok-free.app/callback/${sessionId}`,
            reason: 'Age verification',
            scope: [
                {
                    id: 1,
                    circuitId: 'credentialAtomicQuerySigV2',
                    query: {
                        allowedIssuers: ['*'],
                        type: 'KYCAgeCredential',
                        context: 'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
                        credentialSubject: {
                            birthday: {
                                $lt: 20050101
                            }
                        }
                    }
                }
            ]
        }
    };

    const qrCode = await qrcode.toDataURL(JSON.stringify(verificationRequest));
    return { sessionId, qrCode };
}

module.exports = { generateVerificationQR };