import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.js';
import errorHandler from './utils/errorHandler.js';

const app = express();
const port = 8080;

dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/user', userRouter);
app.use(errorHandler);

app.get('/', (req, res) => {
	res.send('Server is up!!');
});

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
