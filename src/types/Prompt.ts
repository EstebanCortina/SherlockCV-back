export type Prompt = {
    context?: string,
    contextData?: string | null,
    instructions: string,
    fewShotExamples?: string | null,
    dataInput: string
}