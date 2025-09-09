import express from 'express';
import { exportTasksReport, exportUsersReport } from '../controllers/reportController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/export/tasks', protect , adminOnly, exportTasksReport);
router.get('/export/users', protect, adminOnly,  exportUsersReport);

export default router;
