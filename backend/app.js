import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import r_torcedor from './routes/r_torcedor.js';
import r_time from './routes/r_time.js';
import { connect } from './config/db.js';

dotenv.config(); 

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

connect();

app.use('/', r_torcedor);
app.use('/', r_time);

app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`);
});
