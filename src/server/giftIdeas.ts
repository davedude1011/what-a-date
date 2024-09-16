"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getGiftIdea(description: string, eventData: { id: number; eventType: string | null; eventName: string | null; eventDay: number | null; eventMonth: number | null; eventYear: number | null; isRecurring: boolean | null; createdAt: Date; updatedAt: Date | null; }) {
    const prompt = `You are a bot designed to to give gift recomendations based on a user description and the event data for the occasion. here is your data: ${description} [EVENT DATA: ${JSON.stringify(eventData)}]`;
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text()
}