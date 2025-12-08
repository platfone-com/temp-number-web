# Security Policy

## Reporting a Vulnerability

We take the security of our software seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities to: **support@platfone.com**

Please include the following information in your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- You should receive an acknowledgment within 48 hours
- We will keep you informed about the progress of the fix
- We will notify you when the vulnerability is fixed
- We appreciate responsible disclosure and will credit you for the discovery (unless you prefer to remain anonymous)

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| < 1.0   | :x:                |

## Security Best Practices

When deploying this application:

1. Always use HTTPS in production
2. Keep dependencies up to date
3. Use strong authentication mechanisms
4. Implement rate limiting
5. Follow the principle of least privilege
6. Regularly review and rotate secrets
7. Enable audit logging

Thank you for helping keep our project secure!
