// backend/src/controllers/taskController.js

import { pool } from '../index.js';

// Helper function to calculate progress
const calculateProgress = (todoChecklist) => {
    const totalItems = todoChecklist.length;
    if (totalItems === 0) return 0;
    const completedCount = todoChecklist.filter(item => item.completed).length;
    return Math.round((completedCount / totalItems) * 100);
};

// GET /api/tasks/dashboard-data
export const getDashboardData = async (req, res) => {
    try {
        // Get statistics
        const totalTasksRes = await pool.query(`SELECT COUNT(*) FROM tasks`);
        const pendingRes = await pool.query(`SELECT COUNT(*) FROM tasks WHERE status = 'todo'`);
        const completedRes = await pool.query(`SELECT COUNT(*) FROM tasks WHERE status = 'done'`);
        const overdueRes = await pool.query(`SELECT COUNT(*) FROM tasks WHERE due_date < CURRENT_DATE AND status != 'done'`);

        const totalTasks = parseInt(totalTasksRes.rows[0].count);
        const pendingTasks = parseInt(pendingRes.rows[0].count);
        const completedTasks = parseInt(completedRes.rows[0].count);
        const overdueTasks = parseInt(overdueRes.rows[0].count);

        // Charts data
        const distributionRes = await pool.query(
            `SELECT status, COUNT(*) AS count FROM tasks GROUP BY status`
        );

        const priorityRes = await pool.query(
            `SELECT priority, COUNT(*) AS count FROM tasks GROUP BY priority`
        );

        const taskDistribution = {
            Pending: 0,
            InProgress: 0,
            Completed: 0,
            All: totalTasks
        };

        distributionRes.rows.forEach(row => {
            if (row.status === 'todo') taskDistribution.Pending = parseInt(row.count);
            if (row.status === 'in-progress') taskDistribution.InProgress = parseInt(row.count);
            if (row.status === 'done') taskDistribution.Completed = parseInt(row.count);
        });

        const taskPriorityLevels = {
            Low: 0,
            Medium: 0,
            High: 0
        };

        priorityRes.rows.forEach(row => {
            if (row.priority === 'low') taskPriorityLevels.Low = parseInt(row.count);
            if (row.priority === 'medium') taskPriorityLevels.Medium = parseInt(row.count);
            if (row.priority === 'high') taskPriorityLevels.High = parseInt(row.count);
        });

        // Recent tasks
        const recentRes = await pool.query(
            `SELECT id, title, priority, status, due_date AS dueDate, created_at AS createdAt FROM tasks ORDER BY created_at DESC LIMIT 5`
        );

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks: recentRes.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// GET /api/tasks/user-dashboard-data
export const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalTasksRes = await pool.query(
            `SELECT COUNT(*) FROM tasks WHERE assigned_to @> $1`,
            [JSON.stringify([userId])]
        );
        const pendingRes = await pool.query(
            `SELECT COUNT(*) FROM tasks WHERE assigned_to @> $1 AND status = 'todo'`,
            [JSON.stringify([userId])]
        );
        const completedRes = await pool.query(
            `SELECT COUNT(*) FROM tasks WHERE assigned_to @> $1 AND status = 'done'`,
            [JSON.stringify([userId])]
        );
        const overdueRes = await pool.query(
            `SELECT COUNT(*) FROM tasks WHERE assigned_to @> $1 AND due_date < CURRENT_DATE AND status != 'done'`,
            [JSON.stringify([userId])]
        );

        const totalTasks = parseInt(totalTasksRes.rows[0].count);
        const pendingTasks = parseInt(pendingRes.rows[0].count);
        const completedTasks = parseInt(completedRes.rows[0].count);
        const overdueTasks = parseInt(overdueRes.rows[0].count);

        const distributionRes = await pool.query(
            `SELECT status, COUNT(*) AS count FROM tasks WHERE assigned_to @> $1 GROUP BY status`,
            [JSON.stringify([userId])]
        );

        const priorityRes = await pool.query(
            `SELECT priority, COUNT(*) AS count FROM tasks WHERE assigned_to @> $1 GROUP BY priority`,
            [JSON.stringify([userId])]
        );

        const taskDistribution = {
            Pending: 0,
            InProgress: 0,
            Completed: 0,
            All: totalTasks
        };

        distributionRes.rows.forEach(row => {
            if (row.status === 'todo') taskDistribution.Pending = parseInt(row.count);
            if (row.status === 'in-progress') taskDistribution.InProgress = parseInt(row.count);
            if (row.status === 'done') taskDistribution.Completed = parseInt(row.count);
        });

        const taskPriorityLevels = {
            Low: 0,
            Medium: 0,
            High: 0
        };

        priorityRes.rows.forEach(row => {
            if (row.priority === 'low') taskPriorityLevels.Low = parseInt(row.count);
            if (row.priority === 'medium') taskPriorityLevels.Medium = parseInt(row.count);
            if (row.priority === 'high') taskPriorityLevels.High = parseInt(row.count);
        });

        const recentRes = await pool.query(
            `SELECT id, title, priority, status, due_date AS dueDate, created_at AS createdAt FROM tasks WHERE assigned_to @> $1 ORDER BY created_at DESC LIMIT 5`,
            [JSON.stringify([userId])]
        );

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks: recentRes.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// GET /api/tasks/
export const getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        const filter = isAdmin ? '' : `WHERE assigned_to @> $1`;

        let tasksResult;
        if (isAdmin) {
            tasksResult = await pool.query(
                `SELECT id, title, description, priority, status, due_date AS dueDate, created_at AS createdAt FROM tasks`
            );
        } else {
            tasksResult = await pool.query(
                `SELECT id, title, description, priority, status, due_date AS dueDate, created_at AS createdAt FROM tasks ${filter}`,
                [JSON.stringify([userId])]
            );
        }

        const tasks = tasksResult.rows;

        // Get status summary
        const countQuery = isAdmin
            ? `SELECT status, COUNT(*) AS count FROM tasks GROUP BY status`
            : `SELECT status, COUNT(*) AS count FROM tasks WHERE assigned_to @> $1 GROUP BY status`;

        const countRes = isAdmin
            ? await pool.query(countQuery)
            : await pool.query(countQuery, [JSON.stringify([userId])]);

        const statusSummary = {
            all: tasks.length,
            pendingTasks: 0,
            inProgressTasks: 0,
            completedTasks: 0
        };

        countRes.rows.forEach(row => {
            if (row.status === 'todo') statusSummary.pendingTasks = parseInt(row.count);
            if (row.status === 'in-progress') statusSummary.inProgressTasks = parseInt(row.count);
            if (row.status === 'done') statusSummary.completedTasks = parseInt(row.count);
        });

        res.status(200).json({ tasks, statusSummary });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// GET /api/tasks/:id
export const getTaskById = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const result = await pool.query(
            `SELECT id, title, description, priority, status, due_date AS dueDate, assigned_to, created_by AS createdBy, todo_checklist AS todoChecklist, attachments, progress FROM tasks WHERE id = $1`,
            [taskId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// POST /api/tasks/
export const createTask = async (req, res) => {
    try {
        const { title, description, priority, due_date, assigned_to, todo_checklist, attachments } = req.body;
        const createdBy = req.user.id;

        const assignedToJson = JSON.stringify(assigned_to || []);
        const todoChecklistJson = JSON.stringify(todo_checklist || []);
        const attachmentsJson = JSON.stringify(attachments || []);

        const result = await pool.query(
            `INSERT INTO tasks (title, description, priority, due_date, assigned_to, created_by, todo_checklist, attachments, status, progress, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'todo', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING id, title, description, priority, status, due_date AS dueDate, assigned_to, created_by AS createdBy, todo_checklist AS todoChecklist, attachments, progress`,
            [title, description, priority, due_date, assignedToJson, createdBy, todoChecklistJson, attachmentsJson]
        );

        res.status(201).json({
            message: "Task created successfully",
            task: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const { title, description, priority, due_date, assigned_to, todo_checklist, attachments } = req.body;

        // Validate assigned_to is array of user ids
        if (assigned_to && !Array.isArray(assigned_to)) {
            return res.status(400).json({ error: "assigned_to must be an array of user IDs" });
        }

        const taskRes = await pool.query(
            `SELECT * FROM tasks WHERE id = $1`,
            [taskId]
        );

        if (taskRes.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        const fields = [];
        const values = [];
        let index = 1;

        if (title !== undefined) {
            fields.push(`title = $${index++}`);
            values.push(title);
        }
        if (description !== undefined) {
            fields.push(`description = $${index++}`);
            values.push(description);
        }
        if (priority !== undefined) {
            fields.push(`priority = $${index++}`);
            values.push(priority);
        }
        if (due_date !== undefined) {
            fields.push(`due_date = $${index++}`);
            values.push(due_date);
        }
        if (assigned_to !== undefined) {
            fields.push(`assigned_to = $${index++}`);
            values.push(JSON.stringify(assigned_to));
        }
        if (todo_checklist !== undefined) {
            fields.push(`todo_checklist = $${index++}`);
            values.push(JSON.stringify(todo_checklist));
        }
        if (attachments !== undefined) {
            fields.push(`attachments = $${index++}`);
            values.push(JSON.stringify(attachments));
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        values.push(taskId);

        const query = `UPDATE tasks SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${index} RETURNING id, title, description, priority, status, due_date AS dueDate, assigned_to, created_by AS createdBy, todo_checklist AS todoChecklist, attachments, progress`;

        const updatedTask = await pool.query(query, values);

        res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);

        const result = await pool.query(
            `DELETE FROM tasks WHERE id = $1 RETURNING id`,
            [taskId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// PUT /api/tasks/:id/status
export const updateTaskStatus = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const { status } = req.body;

        const taskRes = await pool.query(
            `SELECT * FROM tasks WHERE id = $1`,
            [taskId]
        );

        if (taskRes.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        const task = taskRes.rows[0];

        // Check if assigned and user is not admin
        if (task.assigned_to && task.assigned_to.length > 0 && req.user.role !== 'admin') {
            if (!task.assigned_to.includes(req.user.id)) {
                return res.status(403).json({ error: "Not authorized to update this task" });
            }
        }

        let todoChecklist = task.todo_checklist || [];
        let progress = task.progress || 0;

        if (status === "done") {
            todoChecklist = todoChecklist.map(item => ({ ...item, completed: true }));
            progress = 100;
        }

        await pool.query(
            `UPDATE tasks SET status = $1, todo_checklist = $2, progress = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4`,
            [status, JSON.stringify(todoChecklist), progress, taskId]
        );

        res.status(200).json({ message: "Task status updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// PUT /api/tasks/:id/todo
export const updateTaskChecklist = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const { todoChecklist } = req.body;

        const taskRes = await pool.query(
            `SELECT * FROM tasks WHERE id = $1`,
            [taskId]
        );

        if (taskRes.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        const task = taskRes.rows[0];

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Not authorized to update checklist" });
        }

        const updatedChecklist = todoChecklist.map(item => ({
            text: item.text,
            completed: item.completed
        }));

        const completedCount = updatedChecklist.filter(item => item.completed).length;
        const totalItems = updatedChecklist.length;
        const progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        let status = 'todo';
        if (progress === 100) {
            status = 'done';
        } else if (progress > 0) {
            status = 'in-progress';
        }

        await pool.query(
            `UPDATE tasks SET todo_checklist = $1, progress = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4`,
            [JSON.stringify(updatedChecklist), progress, status, taskId]
        );

        const updatedTaskRes = await pool.query(
            `SELECT id, title, description, priority, status, due_date AS dueDate, assigned_to, created_by AS createdBy, todo_checklist AS todoChecklist, attachments, progress FROM tasks WHERE id = $1`,
            [taskId]
        );

        res.status(200).json({ message: "Task checklist updated", task: updatedTaskRes.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
