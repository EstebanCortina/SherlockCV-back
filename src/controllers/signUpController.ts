import {Request, Response} from 'express';
import UserModel from "../models/UserModel.js";

export default async (req: Request, res: Response)  => {
    try{
        const newUser = await new UserModel().create(["?", "?", "?", "?", "?"], true).run(Object.values(req.body))
        res.status(200).send({message: 'New user registered', data: newUser});
    }catch (err: any){
        console.log(err)
        res.status(err.httpStatus).send({message: 'Internal Server Error'});
    }
}