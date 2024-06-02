import {GenerationConfig} from "../types/GenerationConfig.js";
import {GenerativeModel, GoogleGenerativeAI} from "@google/generative-ai";
import {Request, Response, NextFunction} from "express";

export default async function(req: Request, res: Response, next: NextFunction) {
    // esto debe estar en una clase llamada AIModel
    // para podemo manejarse por inyeccion de depdencias y usar diferentes modelos de ia
    if(!process.env.API_KEY ||
        !process.env.AI_TOP_P ||
        !process.env.AI_TOP_K ||
        !process.env.AI_TEMPERATURE) {
        return res.status(500).send("Internal server error")
    }
    const genAI:GoogleGenerativeAI = new GoogleGenerativeAI(process.env.API_KEY);
    const generationConfig: GenerationConfig = {
        temperature: parseInt(process.env.AI_TEMPERATURE),
        topP: parseInt(process.env.AI_TOP_P),
        topK: parseInt(process.env.AI_TOP_K)
    };
    //Los modelos de gemini tienen diferentes optimizaciones
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro", generationConfig});


    //const prompt = "Dime que entiendes de este texto:\n" + cvs
    const contexto = process.env.PROMPT_CONTEXT;

    let cvs = "";
    //@ts-ignore
    for (let candidate of req.candidatesInfo) {
        cvs += candidate.content + "--------------------------------------\n"
    }
    let prompt = contexto + cvs
    prompt += `\n5.-  Salida de datos en formato Array JSON:`

    const { totalTokens } = await model.countTokens(prompt);
    console.log(prompt)
    console.log(`Total de tokens gastados: ${totalTokens}`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    // @ts-ignore
    req.analysis = response.text();
    next()
}