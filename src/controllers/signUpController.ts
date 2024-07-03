import {Request, Response} from 'express';
import UserModel from "../models/UserModel.js";

export default async (req: Request, res: Response)  => {
    try{
        const newUser = await new UserModel().create(Object.values(req.body), true).run()
        res.status(200).send({message: 'New user registered', data: newUser});
    }catch (err: any){
        console.log(err)
        res.status(err.httpStatus).send({message: 'Internal Server Error'});
    }
}