import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API; // Add your Gemini API key here
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getFarmingAdvice(query: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `You are a highly knowledgeable agricultural expert with decades of experience in sustainable farming, 
    precision agriculture, and traditional farming practices. 
    Your task is to provide a comprehensive, practical, 
    and well-structured response to help farmers improve their productivity and sustainability
    
    Query: ${query}
    
    Please structure your response with clear sections and actionable steps.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error getting farming advice:', error);
    return 'Sorry, I encountered an error while processing your request. Please try again later.';
  }
}