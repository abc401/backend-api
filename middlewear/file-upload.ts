import {Request} from 'express'
import multer from 'multer'

type MulterCallBack = (error: Error | null, destination: string) => void;

const storagePFP = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: MulterCallBack) => {
        cb(null, "profile-pics");
    },
    filename: (req: Request, file: Express.Multer.File, cb: MulterCallBack) => {
        // const { email } = req.body;
        cb(null, file.originalname);
    }
})

export const uploadPFP = multer({storage: storagePFP});