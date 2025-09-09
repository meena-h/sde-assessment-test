// backend/src/controllers/reportController.js

import { pool } from '../index.js';
import ExcelJS from 'exceljs';

// Export Tasks Report
export const exportTasksReport = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, title, description, priority, status, due_date AS dueDate, assigned_to, created_by AS createdBy, progress, created_at AS createdAt FROM tasks ORDER BY id`
        );

        const tasks = result.rows;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tasks Report');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Description', key: 'description', width: 40 },
            { header: 'Priority', key: 'priority', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Due Date', key: 'dueDate', width: 20 },
            { header: 'Assigned To', key: 'assignedTo', width: 30 },
            { header: 'Created By', key: 'createdBy', width: 30 },
            { header: 'Progress', key: 'progress', width: 10 },
            { header: 'Created At', key: 'createdAt', width: 20 },
        ];

        tasks.forEach(task => {
            worksheet.addRow({
                id: task.id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
                assignedTo: task.assigned_to ? JSON.stringify(task.assigned_to) : '',
                createdBy: task.createdBy,
                progress: task.progress,
                createdAt: task.createdAt ? new Date(task.createdAt).toLocaleString() : ''
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=tasks_report.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// Export Users Report
export const exportUsersReport = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, username, email, full_name AS fullName, profile_url AS profileUrl, role, created_at AS createdAt, updated_at AS updatedAt FROM users ORDER BY id`
        );

        const users = result.rows;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users Report');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Username', key: 'username', width: 20 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Full Name', key: 'fullName', width: 25 },
            { header: 'Profile URL', key: 'profileUrl', width: 30 },
            { header: 'Role', key: 'role', width: 15 },
            { header: 'Created At', key: 'createdAt', width: 20 },
            { header: 'Updated At', key: 'updatedAt', width: 20 }
        ];

        users.forEach(user => {
            worksheet.addRow({
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                profileUrl: user.profileUrl,
                role: user.role,
                createdAt: user.createdAt ? new Date(user.createdAt).toLocaleString() : '',
                updatedAt: user.updatedAt ? new Date(user.updatedAt).toLocaleString() : ''
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=users_report.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
