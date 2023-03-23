import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/user'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import authenticateUser from '../middlewear/auth';

const router = Router();
const authSecret = process.env.AUTH_JWT_SECRET;

router.all('/', (req, res) => {
    return res.status(200).json({
        msg: "Welcome to the user endpoint of the ecommerce api"
    })
});

export const userNameLength = 5;
export const passwordLength = 8;

import { signUp } from '../response-messages';

router.post(
    '/signup',

    body('username').isLength({ min: userNameLength })
    .withMessage(signUp.error.userNameLength),

    body('email').isEmail()
    .withMessage(signUp.error.badEmail),

    body('password').isLength({ min: passwordLength })
    .withMessage(signUp.error.passwordLength)

    .matches(/^.*[A-Z].*$/)
    .withMessage(signUp.error.upperCharsInPassword)

    .matches(/^.*[a-z].*$/)
    .withMessage(signUp.error.lowerCharsInPassword)
    
    .matches(/^.*[0-9].*$/)
    .withMessage(signUp.error.digitsInPassword)
    
    .matches(/^.*[^\w\s].*$/)
    .withMessage(signUp.error.specialCharsInPassword),

    async (req, res) => {
        const {username, password, email} = req.body;
        
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ erros: errors.array() })
        }

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);

        try {
            await new User({
                username: username,
                email: email,
                password: secPassword
            }).save()
        } catch (err: any) {
            if (err.name === 'MongoServerError' && err.code === 11000) {
                return res.status(400).json({
                    errors: [{
                        value: email,
                        msg: signUp.error.emailAlreadyUsed,
                        param: "email",
                        location: "body"
                    }]
                })
            }

            return res.status(422).json({
                msg: "Unprocessable request."
            })
        }
        return res.status(201).json({
            msg: signUp.success.userCreated
        });
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
        const data: any = {
            id: user.email,
        }
        const authToken = jwt.sign(data, authSecret!, { expiresIn: "24h" });
        return res.status(200).json({
            authToken: authToken,
        })
    }
)

router.post(
    "/logout",
    authenticateUser,
    async (req: Request, res: Response) => {
        const user = req.body.user;
        await User.updateOne({ email: user.email }, { loggedIn: false });
        return res.status(200).json({
            msg: "Logout successful"
        })
    }
)


export default router;