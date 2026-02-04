/**
 * Authentication Service
 * WARNING: This file contains INTENTIONAL security vulnerabilities for testing!
 * DO NOT use this code in production!
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// VULNERABILITY 1: Hardcoded secret key
const JWT_SECRET = 'super-secret-key-12345';

// VULNERABILITY 2: Hardcoded database credentials  
const DB_PASSWORD = 'admin123';
const API_KEY = 'sk-live-abc123xyz789';

/**
 * Login endpoint
 * VULNERABILITY 3: SQL Injection
 */
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // SQL Injection vulnerability - user input directly in query
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    try {
        const result = await pool.query(query);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const token = jwt.sign({ id: user.id }, JWT_SECRET);
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get user profile
 * VULNERABILITY 4: Missing null check (potential crash)
 * VULNERABILITY 5: Exposing sensitive data
 */
app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    // Missing null check - will crash if user not found
    const user = result.rows[0];

    // Exposing sensitive data in response
    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        ssn: user.ssn,              // PII exposure!
        password_hash: user.password // Never expose password hashes!
    });
});

/**
 * Execute command endpoint
 * VULNERABILITY 6: Command Injection
 */
app.post('/exec', (req, res) => {
    const { command } = req.body;

    // Command injection - executing user input directly
    const exec = require('child_process').exec;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json({ output: stdout });
    });
});

/**
 * File operations
 * VULNERABILITY 7: Path Traversal
 */
app.get('/file', (req, res) => {
    const fs = require('fs');
    const filename = req.query.name;

    // Path traversal vulnerability - no sanitization
    const content = fs.readFileSync('/uploads/' + filename, 'utf8');
    res.send(content);
});

/**
 * Email validation
 * VULNERABILITY 8: ReDoS (Regular Expression Denial of Service)
 */
function validateEmail(email) {
    // ReDoS vulnerable regex - catastrophic backtracking
    const regex = /^([a-zA-Z0-9]+)*@([a-zA-Z0-9]+)*\.([a-zA-Z0-9]+)*$/;
    return regex.test(email);
}

app.post('/validate-email', (req, res) => {
    const { email } = req.body;
    const isValid = validateEmail(email);
    res.json({ valid: isValid });
});

/**
 * Delete user
 * VULNERABILITY 9: Missing authentication check
 */
app.delete('/user/:id', async (req, res) => {
    // No authentication check - anyone can delete any user!
    const userId = req.params.id;
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ success: true });
});

/**
 * XSS vulnerable endpoint
 * VULNERABILITY 10: Cross-Site Scripting
 */
app.get('/search', (req, res) => {
    const query = req.query.q;
    // XSS vulnerability - reflecting user input without sanitization
    res.send(`<html><body><h1>Search results for: ${query}</h1></body></html>`);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
