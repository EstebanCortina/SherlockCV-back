import {GenerationConfig} from "../types/GenerationConfig.js";
import {GenerativeModel, GoogleGenerativeAI} from "@google/generative-ai";
import {GeminiAiModel} from "../models/GeminiAiModel.js";
import {Request, Response, NextFunction} from "express";
import {Prompt} from "../types/Prompt.js";

export default async function(req: Request, res: Response, next: NextFunction) {
    // TODO: make config file for validate all env vars
    let cvs = "";
    //@ts-ignore
    for (let candidate of req.candidatesInfo) {
        cvs += "--------------------------------------\n" + candidate.content
    }

    const gemini = new GeminiAiModel(10000, "gemini-1.0-pro")
    // TODO: next refactor PromptMaker
    const prompt: Prompt = {
        context: process.env["PROMPT_CONTEXT"]?? "",
        contextData: process.env["PROMPT_CONTEXT_DATA"]?? "",
        instructions: process.env["PROMPT_INSTRUCTIONS"]?? "",
        fewShotExamples: process.env["PROMPT_FEW_SHOTS_EXAMPLES"]?? "",
        dataInput: `4.- Entrada de datos:\n${cvs}`
    }
    //@ts-ignore
    req.analysis = await gemini.sendPrompt(prompt)
    next()
}