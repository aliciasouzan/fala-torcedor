import express from 'express';
import { getTorcedores, createTorcedor, updateTorcedor, deleteTorcedor } from '../controllers/c_torcedor.js';

const router = express.Router();

router.get('/torcedores', getTorcedores);
router.post('/torcedores', createTorcedor);
router.put('/torcedores/:id', updateTorcedor);
router.delete('/torcedores/:id', deleteTorcedor);

export default router;