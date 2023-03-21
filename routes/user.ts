import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/user'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const router = Router();
const authSecret = process.env.AUTH_JWT_SECRET;
const refreshSecret = process.env.REFRESH_JWT_SECRET;

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
        const {username, password, email} = req.body;
        
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ erros: errors.array() })
        }

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);



        const onfulfilled = () => {
            return res.status(201).json({
                msg: "User created successfully."
            });
        }

        const onrejected = (err: any) => {
            if (err.name === 'MongoServerError' && err.code === 11000) {
                return res.status(400).json({
                    errors: [
                        {
                            value: email,
                            msg: "The provided email is already in use.",
                            param: "email",
                            location: "body"
                        }
                    ]
                })
            }

            return res.status(422).json({
                msg: "Unprocessable request."
            })
        }

        new User({
            username: username,
            email: email,
            password: secPassword
        })
        .save()
        .then(onfulfilled, onrejected);
    }
)


router.post(
    '/login',
    body('email').isEmail()
    .withMessage('Bad email.'),

    body('password').isLength({ min: 8 })
    .withMessage("Bad password."),

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
                errors: [
                    {
                        msg: "Enter valid credentials."
                    }
                ]
            })
        }
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
            return res.status(400).json({
                errors: [
                    {
                        msg: "Enter valid credentials."
                    }
                ]
            })
        }
        const data = {
            id: user.id,
        }
        const token = jwt.sign(data, authSecret!, { expiresIn: "24h" });
        return res.status(200).json({
            authToken: token
        })
    }
)


export default router;