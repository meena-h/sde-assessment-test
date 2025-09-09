// backend/src/controllers/userController.js

import { pool } from '../index.js';

// GET /api/users
export const getUsers = async (req, res) => {
    try {
        // Fetch all users
        const usersResult = await pool.query(
            `SELECT id, username, email, full_name, profile_url, role, created_at, updated_at FROM users ORDER BY id`
        );

        const users = usersResult.rows;

        // For each user, fetch task counts by status
        const usersWithTasks = await Promise.all(users.map(async (user) => {
            const taskCounts = await pool.query(
                `SELECT status, COUNT(*) AS count FROM tasks WHERE assigned_to = $1 GROUP BY status`,
                [user.id]
            );

            const counts = {
                pendingTasks: 0,
                inProgressTasks: 0,
                completeTasks: 0
            };

            taskCounts.rows.forEach(row => {
                if (row.status === 'todo') counts.pendingTasks = parseInt(row.count);
                if (row.status === 'in-progress') counts.inProgressTasks = parseInt(row.count);
                if (row.status === 'done') counts.completeTasks = parseInt(row.count);
            });

            return {
                ...user,
                pendingTasks: counts.pendingTasks,
                inProgressTasks: counts.inProgressTasks,
                completeTasks: counts.completeTasks
            };
        }));

        res.status(200).json(usersWithTasks);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        // Fetch user info
        const userResult = await pool.query(
            `SELECT id, username, email, full_name, profile_url, role, created_at, updated_at FROM users WHERE id = $1`,
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userResult.rows[0];

        // Fetch tasks assigned to this user grouped by status
        const taskCounts = await pool.query(
            `SELECT status, COUNT(*) AS count FROM tasks WHERE assigned_to = $1 GROUP BY status`,
            [userId]
        );

        const counts = {
            pendingTasks: 0,
            inProgressTasks: 0,
            completeTasks: 0
        };

        taskCounts.rows.forEach(row => {
            if (row.status === 'todo') counts.pendingTasks = parseInt(row.count);
            if (row.status === 'in-progress') counts.inProgressTasks = parseInt(row.count);
            if (row.status === 'done') counts.completeTasks = parseInt(row.count);
        });

        res.status(200).json({
            ...user,
            pendingTasks: counts.pendingTasks,
            inProgressTasks: counts.inProgressTasks,
            completeTasks: counts.completeTasks
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        // Optionally, unassign tasks or handle data integrity here
        await pool.query(
            `UPDATE tasks SET assigned_to = NULL WHERE assigned_to = $1`,
            [userId]
        );

        const result = await pool.query(
            `DELETE FROM users WHERE id = $1 RETURNING id`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(204).send(); // No content

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
