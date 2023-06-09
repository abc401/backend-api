import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
            dropDups: true
        }
    },
    password: {
        type: String,
        required: true
    },
    loggedIn: {
        type: Boolean,
        required: true,
        default: false
    },
});

export default model('User', userSchema);