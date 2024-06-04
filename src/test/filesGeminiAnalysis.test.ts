import dotenv from 'dotenv';
dotenv.config();
import * as chai from "chai"
import sinon from 'sinon'
import {GeminiAiModel} from "../models/GeminiAiModel.js";
import {assert, config, expect} from "chai";
import {Prompt} from "../types/Prompt.js";

class TestGeminiAiModel extends GeminiAiModel {
    constructor(tokensMaxLevel: number, geminiModelName: string) {
        super(tokensMaxLevel, geminiModelName);
    }
    test__getModelConfig(){
        return this.__getModelConfig()
    }
    testSendPrompt(rawPrompt: Prompt){
        return this.sendPrompt(rawPrompt)
    }
}

describe('GeminiAiModel getModelConfig()', () => {
    const geminiModel = new TestGeminiAiModel(
        1,
        "gemini-1.0-pro"
    )
    it('should return a Gemini GenerationConfig', () => {
        const configModel = geminiModel.test__getModelConfig()
        expect(configModel).to.have.property("temperature")
        expect(configModel).to.have.property("topK")
        expect(configModel).to.have.property("topP")
    });
});


describe('GeminiAiModel countPromptTokens()', () => {
    it('should return a number', ()=>{

    })
})

describe('GeminiAiModel sendPrompt()', () => {
    const geminiModel = new TestGeminiAiModel(
        1,
        "gemini-1.0-pro"
    )
    it('should throw a tokens max level exceeded exception', (done) => {
        const prompt: Prompt = {
            instructions: "test",
            dataInput: "test"
        }
        geminiModel.testSendPrompt(prompt).then().catch((err)=>{
            expect(err).to.have.property("message")
            expect(err.message).to.equal("Tokens max level exceeded in Request Prompt")
            done()
        })
    })
})
