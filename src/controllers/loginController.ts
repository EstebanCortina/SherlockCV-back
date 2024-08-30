import {Request, Response} from 'express';
import UserModel from "../models/UserModel.js";
import SJWT from "../config/SJWT.js";
import UserTypeModel from "../models/UserTypeModel.js";

export default async (req: Request, res: Response) => {
    try {
        let user = (
            await (
                new UserModel()
                    .index()
                    .where("email = ? AND password = ? AND is_active = 1")
            ).run([req.body.email, req.body.password])
        )[0];
        if (!user) {
            return res.status(404).send({
                message: 'User not found or incorrect credentials',
                data: null
            });
        }

        const userTypeName = (
            await (
                new UserTypeModel()
                    .index(["name"])
                    .where(["id=?"])
            ).run([user.user_type_id])
        )[0].name

        const jwtPayload = {
            userId: user.id,
            userName: `${user.name}, ${user.last_name}`,
            userTypeName: userTypeName
        }

        const jwt = await SJWT.getJWT(jwtPayload, process.env.JWT_EXPIRATION_DATE?? '2h')

        delete user.id;
        delete user.email;
        delete user.password;
        delete user.user_type_id;
        delete user.is_active;
        delete user.deleted_at;
        user.token = jwt
        res.status(200).send({message: 'Login success', data: user});
    }catch(err: any){
        console.log(err)
        res.status(err.httpStatus).send({message: 'Internal Server Error'});
    }
}