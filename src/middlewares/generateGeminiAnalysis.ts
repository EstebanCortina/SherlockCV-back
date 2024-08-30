import {GeminiAiModel} from "../models/GeminiAiModel.js";
import {Request, Response, NextFunction} from "express";
import {Prompt} from "../types/Prompt.js";


/**
 * Middleware that interacts with Gemini AIG Model for the candidates' analysis.
 *
 * This asynchronous function joins the final prompt for the interaction with
 * `Google Gemini Model` and sends the final string to the service and sets the `req.analysis` property.
 *
 * @async
 * @param {Request} req - The HTTP request object, expected to contain a `candidatesInfo` property.
 * @param {Response} res - The HTTP response object used to send the response.
 * @param next - Next function to execute
 */
export default async (req: Request, res: Response, next: NextFunction) => {
    const gemini = new GeminiAiModel(10000, "gemini-1.0-pro")

    const {job_position_name, job_position_description, score_list} = req.body

    console.log(makePrompt(job_position_name, job_position_description, makeScoreList(score_list), req.candidatesInfo))
    // TODO: next refactor PromptMaker
    req.analysis = await gemini.sendPrompt(
        makePrompt(
            job_position_name,
            job_position_description,
            makeScoreList(score_list),
            req.candidatesInfo
        )
    )
    next()
}

function makePrompt (
    jobName: string,
    jobDecription: string,
    scoreList: string,
    candidatesInfo: Array<any>): Prompt{
    return {
        context: process.env["PROMPT_CONTEXT"]?? "",
        contextData: process.env["PROMPT_CONTEXT_DATA"] + `-Puesto de trabajo: ${jobName} -Descripción: ${jobDecription}`,
        instructions: process.env["PROMPT_INSTRUCTIONS"]?? "",
        scoreList: process.env["PROMPT_SCORE_LIST_CONTEXT"] + scoreList,
        fewShotExamples: process.env["PROMPT_FEW_SHOTS_EXAMPLES"]?? "",
        dataInput: `4.- Entrada de datos:\n${JSON.stringify(candidatesInfo)}`
    }
}

function makeScoreList(scoreListObject: {[key:string]:number}): string{
    let res:string = ''
    for (const [key, value] of Object.entries(scoreListObject)) {
        res += ` # ${key} - ${value} puntos`;
    }
    return res;
}