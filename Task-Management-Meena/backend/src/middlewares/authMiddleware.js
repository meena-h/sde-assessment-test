import jwt from 'jsonwebtoken';
import { pool } from '../index.js';

export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const result = await pool.query('SELECT id, username, email, full_name, profile_url, role FROM users WHERE id = $1', [decoded.id]);
            if (result.rows.length === 0) {
                return res.status(401).json({ message: "User not found" });
            }

            req.user = result.rows[0];
            next();
        } else {
            return res.status(401).json({ message: "Not authorized, no token" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Token failed", error: error.message });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied, admin only" });
    }
};
