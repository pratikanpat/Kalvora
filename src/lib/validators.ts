// Centralized validation utilities for Kalvora
// All validators return { valid, message? } so UI can show inline errors

export interface ValidationResult {
    valid: boolean;
    message?: string;
}

// ---- Email ----
export function validateEmail(email: string): ValidationResult {
    if (!email.trim()) return { valid: true }; // optional
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email.trim()))
        return { valid: false, message: 'Enter a valid email address (e.g. name@example.com)' };
    return { valid: true };
}

// ---- Phone (Indian mobile: 10 digits, starts with 6-9) ----
export function validatePhone(phone: string): ValidationResult {
    if (!phone.trim()) return { valid: true }; // optional
    // Strip spaces, hyphens, +91 prefix for flexibility
    const cleaned = phone.replace(/[\s\-+]/g, '').replace(/^91/, '');
    if (!/^[6-9]\d{9}$/.test(cleaned))
        return { valid: false, message: 'Enter a valid 10-digit Indian mobile number (e.g. 98765 43210)' };
    return { valid: true };
}

// ---- GSTIN (15-char alphanumeric, Indian GST format) ----
export function validateGSTIN(gstin: string): ValidationResult {
    if (!gstin.trim()) return { valid: true }; // optional
    const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!re.test(gstin.trim().toUpperCase()))
        return { valid: false, message: 'Enter a valid 15-character GSTIN (e.g. 27AABCU9603R1ZM)' };
    return { valid: true };
}

// ---- PAN (10-char alphanumeric, Indian PAN format) ----
export function validatePAN(pan: string): ValidationResult {
    if (!pan.trim()) return { valid: true };
    const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!re.test(pan.trim().toUpperCase()))
        return { valid: false, message: 'Enter a valid 10-character PAN (e.g. ABCDE1234F)' };
    return { valid: true };
}

// ---- IFSC Code (11-char, 4 letters + 0 + 6 alphanumeric) ----
export function validateIFSC(ifsc: string): ValidationResult {
    if (!ifsc.trim()) return { valid: true };
    const re = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!re.test(ifsc.trim().toUpperCase()))
        return { valid: false, message: 'Enter a valid 11-character IFSC code (e.g. SBIN0001234)' };
    return { valid: true };
}

// ---- Bank Account Number (9-18 digits) ----
export function validateBankAccount(account: string): ValidationResult {
    if (!account.trim()) return { valid: true };
    const cleaned = account.replace(/\s/g, '');
    if (!/^\d{9,18}$/.test(cleaned))
        return { valid: false, message: 'Enter a valid bank account number (9-18 digits)' };
    return { valid: true };
}

// ---- UPI ID (e.g. name@upi or name@bank) ----
export function validateUpiId(upi: string): ValidationResult {
    if (!upi.trim()) return { valid: true };
    const re = /^[\w.\-]+@[\w]+$/;
    if (!re.test(upi.trim()))
        return { valid: false, message: 'Enter a valid UPI ID (e.g. yourname@upi)' };
    return { valid: true };
}

// ---- HSN/SAC Code (4-8 digits) ----
export function validateHsnSac(code: string): ValidationResult {
    if (!code.trim()) return { valid: true };
    if (!/^\d{4,8}$/.test(code.trim()))
        return { valid: false, message: 'Enter a valid 4-8 digit HSN/SAC code' };
    return { valid: true };
}

// ---- Numeric range (for days, rates, etc.) ----
export function validateNumericRange(value: string, min: number, max: number, label: string): ValidationResult {
    if (!value.trim()) return { valid: true };
    const num = Number(value);
    if (isNaN(num) || num < min || num > max)
        return { valid: false, message: `${label} must be between ${min} and ${max}` };
    return { valid: true };
}
