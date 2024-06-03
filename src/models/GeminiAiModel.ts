import AiModel from "../abstract_classes/AiModel.js";
import {AiSdk} from "../types/AiSdk.js";
import {GenerativeModel, GoogleGenerativeAI} from "@google/generative-ai";
import {GenerationConfig} from "../types/GenerationConfig.js";
import {Prompt} from "../types/Prompt.js";
import {raw} from "express";

export class GeminiAiModel extends AiModel {
    private geminiAiModelName: string
    private gemini: unknown

    constructor(tokensMaxLevel: number, geminiModelName: string) {
        super(tokensMaxLevel)
        this.geminiAiModelName = geminiModelName;
        this.initModel()
    }

    private __getModelConfig(): GenerationConfig  {
        let generationConfig: GenerationConfig;
        if(!process.env.AI_TEMPERATURE ||
            !process.env.AI_TOP_P ||
            !process.env.AI_TOP_K)
        {
            throw new Error("Missing Gemini Generation Configuration")
        }
        return generationConfig = {
            temperature: parseInt(process.env.AI_TEMPERATURE),
            topP: parseInt(process.env.AI_TOP_P),
            topK: parseInt(process.env.AI_TOP_K)
        }
    }

    updateGeminiModelName(name: string): this{
        this.geminiAiModelName = name
        return this
    }

    initModel(): void {
        // TODO: consider make a config dir and import this bellow
        if(!process.env.GEMINI_API_KEY) throw new Error("No Gemini API Key");
        const genAI:GoogleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const generationConfig: GenerationConfig = this.__getModelConfig()
        this.gemini = genAI.getGenerativeModel(
            {
                model: this.geminiAiModelName,
                generationConfig
            });
    }

    async sendPrompt(prompt: Prompt): Promise<string> {
        if(!(this.gemini instanceof GenerativeModel)) {
            throw new Error("Bad Gemini SDK Generative Model");
        }

        // TODO: make a prompt handler or make the PromptMaker
        let rawPrompt: string =`${prompt.context} ${prompt.contextData} ${prompt.instructions} ${prompt.fewShotExamples} ${prompt.dataInput}`;
        rawPrompt += `\n5.-  Salida de datos en formato Array JSON:`
        try {
            const result = await this.gemini.generateContent(rawPrompt);
            return result.response.text();
        }catch(err){
            console.log(err)
            throw err
        }
    }
}