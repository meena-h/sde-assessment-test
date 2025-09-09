import express from 'express';
import { getDashboardData, getUserDashboardData, getTasks , getTaskById ,createTask, updateTask ,deleteTask,updateTaskStatus , updateTaskChecklist } from '../controllers/taskController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/dashboard-data', protect ,getDashboardData);
router.get('/user-dashboard-data', protect, getUserDashboardData);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTaskById);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, adminOnly, deleteTask);
router.put('/:id/status', protect, updateTaskStatus);
router.put('/:id/todo', protect, updateTaskChecklist);

export default router;
