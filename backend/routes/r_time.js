import express from 'express';
import { getTimes, createTime, updateTime, deleteTime } from '../controllers/c_time.js';

const router = express.Router();

router.get('/times', getTimes);
router.post('/times', createTime);
router.put('/times/:id', updateTime);
router.delete('/times/:id', deleteTime);

export default router;