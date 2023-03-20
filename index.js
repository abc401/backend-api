const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const port = process.env.PORT;
const databaseUri = process.env.DATABASE_URI;

mongoose.connect(databaseUri);
const db = mongoose.connection;

db.on('error', (error) => {
    console.error(error);
})

db.once('open', () => {
    console.log('Connected to database');
})

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Welcome to ecommerce api"
    })
})

const userRouter = require('./routes/user')
app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});