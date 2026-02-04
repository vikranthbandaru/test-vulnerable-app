/**
 * Data Processing Utilities
 * WARNING: More intentional vulnerabilities for testing!
 */

const axios = require('axios');
const _ = require('lodash');

/**
 * VULNERABILITY 11: Insecure random number generation
 */
function generateToken() {
    // Using Math.random() for security-sensitive operations
    return Math.random().toString(36).substring(2);
}

/**
 * VULNERABILITY 12: Prototype pollution via lodash merge
 */
function mergeUserData(target, source) {
    // Vulnerable to prototype pollution if source is user-controlled
    return _.merge(target, source);
}

/**
 * VULNERABILITY 13: SSRF (Server-Side Request Forgery)
 */
async function fetchUserAvatar(avatarUrl) {
    // SSRF vulnerability - no URL validation
    const response = await axios.get(avatarUrl);
    return response.data;
}

/**
 * VULNERABILITY 14: Insecure deserialization
 */
function parseUserPreferences(data) {
    // Dangerous: deserializing untrusted data
    return eval('(' + data + ')');
}

/**
 * VULNERABILITY 15: Timing attack vulnerability
 */
function compareApiKeys(provided, stored) {
    // Vulnerable to timing attacks - early return reveals key length
    if (provided.length !== stored.length) {
        return false;
    }

    for (let i = 0; i < provided.length; i++) {
        if (provided[i] !== stored[i]) {
            return false;  // Early return leaks timing information
        }
    }

    return true;
}

/**
 * VULNERABILITY 16: Race condition
 */
let balance = 1000;

async function withdraw(amount) {
    // Race condition - check and update not atomic
    if (balance >= amount) {
        // Time gap allows double-spend
        await new Promise(r => setTimeout(r, 100));
        balance -= amount;
        return { success: true, newBalance: balance };
    }
    return { success: false, error: 'Insufficient funds' };
}

/**
 * VULNERABILITY 17: Hardcoded encryption key
 */
const ENCRYPTION_KEY = 'aes-256-key-DO-NOT-USE';

function encrypt(data) {
    const crypto = require('crypto');
    const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

/**
 * VULNERABILITY 18: Logging sensitive data
 */
function processPayment(cardNumber, cvv, amount) {
    console.log(`Processing payment: card=${cardNumber}, cvv=${cvv}, amount=${amount}`);
    // ... payment logic
    return { success: true };
}

module.exports = {
    generateToken,
    mergeUserData,
    fetchUserAvatar,
    parseUserPreferences,
    compareApiKeys,
    withdraw,
    encrypt,
    processPayment
};
