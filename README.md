# Test Vulnerable App

⚠️ **WARNING: This application contains INTENTIONAL security vulnerabilities!**

This is a test application designed to demonstrate the capabilities of the AI Code Reviewer. 
**DO NOT deploy this code to production or use it as a reference for secure coding practices.**

## Vulnerabilities Included

### Critical
1. **SQL Injection** - User input directly concatenated into SQL queries
2. **Command Injection** - Executing user-provided commands via child_process
3. **Hardcoded Secrets** - JWT secrets, API keys, and passwords in source code
4. **Path Traversal** - Unsanitized file paths allow reading arbitrary files

### High
5. **XSS (Cross-Site Scripting)** - Reflecting user input without sanitization
6. **SSRF (Server-Side Request Forgery)** - Fetching arbitrary URLs
7. **Insecure Deserialization** - Using eval() on user data
8. **Sensitive Data Exposure** - Returning SSN and password hashes in API responses

### Medium
9. **ReDoS** - Regular expressions vulnerable to catastrophic backtracking
10. **Missing Authentication** - Delete endpoint has no auth check
11. **Null Pointer Dereference** - Missing null checks before property access
12. **Timing Attack** - Non-constant-time string comparison for secrets

### Low
13. **Insecure Random** - Using Math.random() for security tokens
14. **Race Condition** - Non-atomic balance check and update
15. **Sensitive Data Logging** - Credit card numbers logged to console

### Dependencies
16. **CVE-2021-23337** - lodash@4.17.20 has command injection vulnerability
17. **CVE-2021-3749** - axios@0.21.1 has SSRF vulnerability

## Testing Instructions

1. Install the GitHub App on this repository
2. Create a new branch
3. Make changes to any file (or just add a comment)
4. Open a Pull Request
5. Watch the AI Code Reviewer analyze and comment!

## Expected Results

The AI Code Reviewer should detect:
- Multiple SQL injection points
- Hardcoded credentials
- Command injection vulnerability
- XSS vulnerabilities
- Vulnerable dependency versions
- And more!
