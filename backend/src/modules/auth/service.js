const prisma = require("../../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateRegister } = require("./validation");

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// REGISTER
exports.register = async (data) => {
    validateRegister(data);

    const { email, password, name } = data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    // Generate token
    const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        message: "User created",
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    };
};


// LOGIN
exports.login = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Email and password required");
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    //comparing user passwords for authenticity
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    
    const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        message: "Login successful",
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    };
};