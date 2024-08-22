module.exports = {
    AadharCardSchema: (credentialSubject) => ({
        "circuitId": "credentialAtomicQuerySigV2",
        "id": 1724308791,
        "query": {
            "allowedIssuers": [
                "*"
            ],
            "context": "ipfs://QmaNKpHUyuTdpN2EmFHyY7Puyr4DSwSNk16w9mi9rv9TJQ",
            "type": "KYC",
            "credentialSubject": {
                "phone_number": {
                    "$eq": 9999999999
                }
            }
        }
    })
};