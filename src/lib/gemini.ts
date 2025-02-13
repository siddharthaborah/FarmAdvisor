import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API as string; // Add your Gemini API key here
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getFarmingAdvice(query: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `As an agricultural expert, provide detailed advice on the following query.
    Consider these aspects in your response:
    - Local farming conditions and seasonal factors
    - Sustainable farming practices
    - Cost-effective solutions
    - Traditional and modern farming techniques
    - Risk management
    - Resource optimization
    
    Query: ${query}
    
    Please structure your response with clear sections and actionable steps.`;

    const result = await model.generateContent(prompt);
    return result.generations[0].text;
  } catch (error) {
    console.error('Error getting farming advice:', error);
    return 'Sorry, I encountered an error while processing your request. Please try again later.';
  }
}