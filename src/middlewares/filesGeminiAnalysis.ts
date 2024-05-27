import {GenerativeModel, GoogleGenerativeAI} from "@google/generative-ai";
import {Request, Response, NextFunction} from "express";

export default async function(req: Request, res: Response, next: NextFunction) {
    // esto debe estar en una clase llamada AIModel
    // para podemo manejarse por inyeccion de depdencias y usar diferentes modelos de ia
    if(!process.env.API_KEY){
        return res.status(500).send("Internal server error")
    }
    const genAI:GoogleGenerativeAI = new GoogleGenerativeAI(process.env.API_KEY);

    //Los modelos de gemini tienen diferentes optimizaciones
    const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-1.0-pro"});
    let cvs = "";
    // @ts-ignore
    console.log(req.candidatesInfo)
    // @ts-ignore
    for (let candidate of req.candidatesInfo) {
        cvs += candidate.content + "\n"
    }

    const prompt = "Dime que entiendes de este texto:\n" + cvs
    console.log(prompt)

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    next()
}