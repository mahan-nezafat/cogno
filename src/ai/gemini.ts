import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_KEY })
// text 
// image 
// vision
//audio
//long context
//code exec
//structured output
//funcion calling
//doc understaing
//grounding with google search
//
const gemini = async (model: string, contents: string) => {
    const res = await ai.models.generateContent({
        model: model,
        contents: contents
    })

    console.log(res.text)
}

gemini("", "")