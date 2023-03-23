import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user';
import { auth } from '../response-messages';

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers['authorization']?.split(" ")[1];
    const authSecret = process.env.AUTH_JWT_SECRET!;
    if (authToken == null) {
        return res.status(401).json({
            msg: auth.error.loginRequired
        });
    }

    let payload;
    try {
        payload = jwt.verify(authToken, authSecret) as jwt.JwtPayload;
    } catch (err) {
        return res.status(403).json({
            msg: auth.error.invalidAuthTokenProvided
        });
    }
    
    const user = await User.findOne({ email: payload.email })

    if (user == null) {
        return res.status(404).json({
            msg: auth.error.userDoesNotExist
        });
    }

    if (!user.loggedIn) {
        return res.status(401).json({
            msg: auth.error.loginRequired
        })
    }

    req.body.user = user;
    next();
}

export default authenticateUser;