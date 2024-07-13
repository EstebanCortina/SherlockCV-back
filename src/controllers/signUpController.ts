import {Request, Response} from 'express';
import UserModel from "../models/UserModel.js";
import UserTypeModel from "../models/UserTypeModel.js";

const model = new UserModel()

export default async (req: Request, res: Response)  => {
    const body = req.body;
    try {
        if (await emailAlreadyExists(req.body.email)) {

            return res.status(409).send(
                {
                    message: 'Account already exists with this email'
                });

        }

        req.body.user_type_id = (
            await new UserTypeModel()
                .getUserTypeIdByName("Recruiter")
        )

        const newUser = await (
            model
                .create(
                    ["?", "?", "?", "?", "?"],
                true)
        ).run(Object.values(req.body))

        return res.status(201).send(
            {
                message: 'New user registered', data: newUser
            });

    }catch (err: any){
        console.log(err)

        return res.status(err.httpStatus).send(
            {
                message: 'Internal Server Error'
            });
    }
}

async function emailAlreadyExists(email: string): Promise<boolean> {
    const exists = await (
        model.index(["id"])
            .where("email = ?")
    ).run([email])
    return exists.length > 0
}