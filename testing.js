async function issueClaim(identifier, schemaUrl, schemaType, credentialSubject) {
    debugLog('Starting claim issuance process');
    debugLog('Input parameters:', { identifier, schemaUrl, schemaType, credentialSubject });

    const claimData = {
        credentialSchema: schemaUrl,
        type: schemaType,
        credentialSubject: {
            id: 'did:polygonid:polygon:amoy:2qQqDP7BQ5L8P59iEFbgSpot2MgXGPiRrwmRez7URq',
            ...credentialSubject
        }
    };

    debugLog('Prepared claim data:', claimData);

    const url = `${POLYGON_ID_BASE_URL}/${identifier}/claims`;
    debugLog('Request URL:', url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': AUTH_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(claimData)
        });

        debugLog('Response status:', response.status);
        debugLog('Response headers:', Object.fromEntries(response.headers.entries()));

        const responseText = await response.text();
        debugLog('Response body:', responseText);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
        }

        try {
            const responseJson = JSON.parse(responseText);
            debugLog('Successfully parsed response JSON');
            return responseJson;
        } catch (error) {
            debugLog('Error parsing response JSON:', error);
            throw new Error('Failed to parse response JSON');
        }
    } catch (error) {
        debugLog('Fetch error:', error);
        throw error;
    }
}

// Example usage
async function testClaimIssuance() {
    try {
        const identifier = 'did:polygonid:polygon:amoy:2qaiEUTWyVhyt89VwBMuna9beva9aXHkM49Jk7WDnc';
        const schemaUrl = 'https://raw.githubusercontent.com/anuragasawa20/Kyc-backend/main/aadhar-kyc.json';
        const schemaType = 'KYC';
        const credentialSubject = {
            aadhar_number: '4222202122220',
            gender: 'Male',
            name: 'Anurag',
            phone_number: 9999999999
        };

        debugLog('Starting test claim issuance');
        const result = await issueClaim(identifier, schemaUrl, schemaType, credentialSubject);
        debugLog('Claim issuance successful:', result);
    } catch (error) {
        debugLog('Claim issuance failed:', error);
    }
}

//testClaimIssuance();