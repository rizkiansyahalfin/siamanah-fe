/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate Indonesian phone number format
 * Accepts: 08xxxxxxxxxx or +628xxxxxxxxxx
 * Length: 10-13 digits (excluding +62)
 */
export function validatePhone(phone: string): boolean {
    // Remove all spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, "");

    // Check for +62 format
    if (cleaned.startsWith("+62")) {
        const number = cleaned.slice(3);
        return /^8\d{8,11}$/.test(number);
    }

    // Check for 08 format
    if (cleaned.startsWith("08")) {
        return /^08\d{8,11}$/.test(cleaned);
    }

    return false;
}

/**
 * Validate password strength
 * Minimum 8 characters
 */
export function validatePassword(password: string): boolean {
    return password.length >= 8;
}

/**
 * Get error message for email validation
 */
export function getEmailError(email: string): string | null {
    if (!email) return "Email harus diisi";
    if (!validateEmail(email)) return "Format email tidak valid";
    return null;
}

/**
 * Get error message for phone validation
 */
export function getPhoneError(phone: string): string | null {
    if (!phone) return "Nomor HP harus diisi";
    if (!validatePhone(phone))
        return "Format nomor HP tidak valid (08xxx atau +628xxx)";
    return null;
}

/**
 * Get error message for password validation
 */
export function getPasswordError(password: string): string | null {
    if (!password) return "Password harus diisi";
    if (!validatePassword(password))
        return "Password minimal 8 karakter";
    return null;
}

/**
 * Get error message for confirm password validation
 */
export function getConfirmPasswordError(
    password: string,
    confirmPassword: string,
): string | null {
    if (!confirmPassword) return "Konfirmasi password harus diisi";
    if (password !== confirmPassword) return "Password tidak sama";
    return null;
}
