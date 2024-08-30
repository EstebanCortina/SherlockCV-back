import AiModel from "../abstract_classes/AiModel.js";
import {GenerativeModel, GoogleGenerativeAI} from "@google/generative-ai";
import {GenerationConfig} from "../types/GenerationConfig.js";
import {Prompt} from "../types/Prompt.js";

export class GeminiAiModel extends AiModel {
    private geminiAiModelName: string
    private gemini: unknown

    constructor(tokensMaxLevel: number, geminiModelName: string) {
        super(tokensMaxLevel)
        this.geminiAiModelName = geminiModelName;
        this.initModel()
    }

    protected __getModelConfig(): GenerationConfig  {
        let generationConfig: GenerationConfig;
        if(!process.env.AI_TEMPERATURE ||
            !process.env.AI_TOP_P ||
            !process.env.AI_TOP_K)
        {
            throw new Error("Missing Gemini Generation Configuration")
        }
        return generationConfig = {
            temperature: parseFloat(process.env.AI_TEMPERATURE), //0
            topP: parseFloat(process.env.AI_TOP_P), // 0
            topK: parseFloat(process.env.AI_TOP_K)// 1
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
        // TODO: make a prompt handler or make the PromptMaker
        let rawPrompt: string =`${prompt.context} ${prompt.contextData} ${prompt.instructions} ${prompt.scoreList} ${prompt.fewShotExamples} ${prompt.dataInput}`;
        rawPrompt += `\n5.-  Salida de datos en formato Array JSON:`
        if ((await this.countPromptTokens(rawPrompt)) > this.tokensMaxLevel){
            throw new Error("Tokens max level exceeded in Request Prompt");
        }
        return this.__callPromptApi(rawPrompt)
    }

    private async __callPromptApi(rawPrompt: string): Promise<string> {
        if(!(this.gemini instanceof GenerativeModel)) {
            throw new Error("Bad Gemini SDK Generative Model");
        }
        try {
            const result = await this.gemini.generateContent(rawPrompt);
            return result.response.text();
        }catch(err){
            console.log(err)
            throw err
        }
    }

    async countPromptTokens(rawPrompt:string): Promise<number> {
        if(!(this.gemini instanceof GenerativeModel)) {
            throw new Error("Bad Gemini SDK Generative Model");
        }
        const {totalTokens} = await this.gemini.countTokens(rawPrompt);
        return totalTokens
    }
}