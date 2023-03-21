import express, { json } from 'express';
import { config } from 'dotenv';
import { connect, connection } from 'mongoose';

config();

const port = process.env.PORT;
const databaseUri = process.env.DATABASE_URI;

connect(databaseUri!);
const db = connection;

db.on('error', (error) => {
    console.error(error);
})

db.once('open', () => {
    console.log('Connected to database');
})

const app = express();
app.use(json());
app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Welcome to ecommerce api"
    })
})

import userRouter from './routes/user';
app.use('/user', userRouter);

process.on("uncaughtException", function (error) {
  console.error(error.stack);
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});
