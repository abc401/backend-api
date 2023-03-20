import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/user'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const router = Router();
const accessSecret = process.env.ACCESS_JWT_SECRET;

router.all('/', (req, res) => {
    return res.status(200).json({
        message: "Welcome to the user endpoint of the ecommerce api"
    })
});

router.post(
    '/signup',

    body('username').isLength({ min: 5 })
    .withMessage("Username must be atleast 5 characters long."),

    body('email').isEmail()
    .withMessage("Enter a valid email."),

    body('password').isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")

    .matches(/^.*[A-Z].*$/)
    .withMessage("Password must contain atleast one uppercase letter.")

    .matches(/^.*[a-z].*$/)
    .withMessage("Password must contain atleast one lowercase letter.")
    
    .matches(/^.*[0-9].*$/)
    .withMessage("Password must contain atleast one digit.")
    
    .matches(/^.*[^\w\s].*$/)
    .withMessage("Password must contain atleast one special symbol."),

    async (req, res) => {
        const username: string = req.body.username;
        const password: string = req.body.password;
        const email: string  = req.body.email;
        
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ erros: errors.array() })
        }

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);

        try {
            User.create({
                username: username,
                email: email,
                password: secPassword
            })
            return res.status(201);
        } catch (error) {
            return res.status(400).json({
                message: "The provided email is already in use"
            })
        }
    }
)

router.post(
    '/login',
    body('email').isEmail()
    .withMessage('Bad email provided'),

    body('password').exists()
    .withMessage('Please provide a password'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const {email, password} = req.body;
        const user = await User.findOne({email})
        if (user == null) {
            return res.status(400).json({
                message: "Enter valid credentials"
            })
        }
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
            return res.status(400).json({
                message: "Enter valid credentials"
            })
        }
        const data = {
            id: user.id
        }
        const token = jwt.sign(data, accessSecret!);
        return res.status(200).json({

        })
    }
)

export default router;