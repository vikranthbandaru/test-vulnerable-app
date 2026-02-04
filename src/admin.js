/**
 * Admin Panel - New Feature
 * WARNING: More intentional vulnerabilities for testing the AI Code Reviewer!
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const { exec } = require('child_process');

// VULNERABILITY: Hardcoded admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';
const ADMIN_API_KEY = 'admin-secret-key-xyz789';

/**
 * Admin login - intentionally insecure
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // VULNERABILITY: Timing attack - non-constant time comparison
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // VULNERABILITY: Predictable session token
        const sessionToken = 'admin-session-' + Date.now();
        res.json({ token: sessionToken });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

/**
 * Execute system command - extremely dangerous!
 */
router.post('/system/exec', (req, res) => {
    const { cmd } = req.body;

    // VULNERABILITY: Direct command execution without sanitization
    exec(cmd, (error, stdout, stderr) => {
        res.json({
            output: stdout,
            error: stderr
        });
    });
});

/**
 * Read any file on the system
 */
router.get('/files/read', (req, res) => {
    const { path } = req.query;

    // VULNERABILITY: Path traversal - can read any file
    try {
        const content = fs.readFileSync(path, 'utf8');
        res.json({ content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Write to any file on the system
 */
router.post('/files/write', (req, res) => {
    const { path, content } = req.body;

    // VULNERABILITY: Arbitrary file write
    fs.writeFileSync(path, content);
    res.json({ success: true });
});

/**
 * Database backup - exposes connection string
 */
router.get('/backup', (req, res) => {
    // VULNERABILITY: Exposing database credentials in response
    const dbConfig = {
        host: 'production-db.example.com',
        user: 'root',
        password: 'SuperSecretDbPassword123!',
        database: 'production_data'
    };

    // VULNERABILITY: Logging sensitive data
    console.log('Backup requested with config:', JSON.stringify(dbConfig));

    res.json({
        message: 'Backup initiated',
        config: dbConfig  // Never expose this!
    });
});

/**
 * User impersonation - no authorization check
 */
router.post('/impersonate/:userId', (req, res) => {
    // VULNERABILITY: No authorization check - any user can impersonate anyone
    const { userId } = req.params;

    // Create a token for the impersonated user
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
        { id: userId, impersonated: true },
        'another-hardcoded-secret'  // VULNERABILITY: Hardcoded JWT secret
    );

    res.json({ token });
});

/**
 * Bulk user deletion - mass destruction capability
 */
router.delete('/users/bulk', async (req, res) => {
    const { userIds } = req.body;

    // VULNERABILITY: No confirmation, no audit log, no authorization
    // An attacker could delete all users
    const { Pool } = require('pg');
    const pool = new Pool();

    for (const id of userIds) {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
    }

    res.json({ deleted: userIds.length });
});

module.exports = router;
