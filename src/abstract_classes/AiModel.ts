import {Prompt} from "../types/Prompt.js";

export default abstract class AiModel {
    protected constructor(protected tokensMaxLevel: number){}

    abstract initModel(): void
    abstract sendPrompt (prompt: Prompt): Promise<string> | string
    abstract countPromptTokens(rawPrompt: string): Promise<number> | number;
}
