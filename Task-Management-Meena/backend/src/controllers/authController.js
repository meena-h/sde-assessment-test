// backend/src/controllers/authController.js
import { pool } from '../index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserSchema } from '../models/User.js';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
    try {
        const { error, value } = UserSchema.create.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { username, email, full_name, password, invite_token } = value;

        const existing = await pool.query("SELECT id FROM users WHERE email = $1 OR username = $2", [email, username]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: "Username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Assign role based on invite_token
        let role = 'user';
        if (invite_token && invite_token === 'ADMIN2025') {
            role = 'admin';
        }

        const result = await pool.query(
            `INSERT INTO users (username, email, full_name, password,  role) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, full_name, role`,
            [username, email, full_name, hashedPassword, role]
        );

        const user = result.rows[0];

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            token: generateToken(user.id)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            token: generateToken(user.id)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { error, value } = UserSchema.update.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const fields = [];
        const values = [];
        let index = 1;

        for (const [key, val] of Object.entries(value)) {
            fields.push(`${key} = $${index}`);
            values.push(val);
            index++;
        }

        values.push(req.user.id);

        const query = `UPDATE users SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${index} RETURNING id, username, email, full_name, role`;
        const result = await pool.query(query, values);

        const user = result.rows[0];
        res.status(200).json(user);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
