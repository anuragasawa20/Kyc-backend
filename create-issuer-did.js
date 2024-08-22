const ethers = require('ethers');
const { EthrDID } = require('ethr-did');

function createIssuerDid() {
    // Create a new Ethereum account
    const wallet = ethers.Wallet.createRandom();

    // Get the private key and address
    const privateKey = wallet.privateKey;
    const address = wallet.address;

    // Create a new EthrDID instance
    const did = new EthrDID({
        identifier: address,
        privateKey: privateKey.slice(2) // Remove '0x' prefix
    });

    return {
        privateKey,
        did: did.did,
        address
    };
}

// Generate and log the issuer information
const issuerInfo = createIssuerDid();
console.log('Issuer Private Key:', issuerInfo.privateKey);
console.log('Issuer DID:', issuerInfo.did);
console.log('Issuer Ethereum Address:', issuerInfo.address);

module.exports = { createIssuerDid };
