import { Schema, model } from 'mongoose';
import { defaultPFPFilelName } from '../config';

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
    pfp: {
        type: String,
        required: true,
        default: defaultPFPFilelName
    }
});

export default model('User', userSchema);