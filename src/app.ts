import express from 'express';
import authRouter from  './routes/authRoutes.ts'
import { auth } from './middleware/auth.ts';
import userRouter from './routes/userRoutes.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.send('API RODANDO');
});

app.use(authRouter);

app.use(auth);
// privados

app.use(userRouter);

app.listen(PORT, () => {
    console.log(`Server port ${PORT}`);
});