import { Router } from 'express';
import { body, validationResult } from 'express-validator';
const router = Router();

router.all('/',
body('username').isEmail(),
(req, res) => {
    return res.status(200).json({
        message: "Welcome to the user endpoint of the ecommerce api"
    })
});

router.post('/signup', (req, res) => {
    
})

export default router;
