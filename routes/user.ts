import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/user'
const router = Router();

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
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ erros: errors.array() })
        }
        try {
            const createdUser = await User.create({
                username: username,
                email: email,
                password: password
            })
            return res.status(201).json({
                created: createdUser
            })
        } catch (error) {
            return res.status(400).json({
                message: "The provided email is already in use"
            })
        }
    })

export default router;
