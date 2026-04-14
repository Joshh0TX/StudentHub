// Strong but realistic rules
exports.validateRegister = ({ email, password, name }) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    // email check
    if (!email.includes("@")) {
        throw new Error("Invalid email format");
    }

    // Password rules
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    if (!/[A-Z]/.test(password)) {
        throw new Error("Password must contain at least one uppercase letter");
    }

    if (!/[0-9]/.test(password)) {
        throw new Error("Password must contain at least one number");
    }

    if (!name) {
        throw new Error("Input your name");
    }

    return true;
};

