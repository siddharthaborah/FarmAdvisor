import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API; // Gemini API Key
const PLANT_ID_API_KEY = import.meta.env.VITE_PLANT_ID_API; // Plant.id API Key

const genAI = new GoogleGenerativeAI(API_KEY);

// 🌱 Get AI-Powered Farming Advice (Existing Function)
export async function getFarmingAdvice(query: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a highly knowledgeable agricultural expert with decades of experience in sustainable farming, 
    precision agriculture, and traditional farming practices. 
    Your task is to provide a comprehensive, practical, 
    and well-structured response to help farmers improve their productivity and sustainability.
    
    Query: ${query}
    
    Please structure your response with clear sections and actionable steps.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error getting farming advice:', error);
    return 'Sorry, I encountered an error while processing your request. Please try again later.';
  }
}

// 🍃 Identify Plant Diseases & Health Assessment
export async function analyzePlant(imageFile: File) {
  try {
    const formData = new FormData();
    formData.append("images", imageFile);
    formData.append("organs", "leaf"); // Adjust based on plant part

    const response = await fetch("https://api.plant.id/v2/identify", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PLANT_ID_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to analyze plant");
    }

    const data = await response.json();

    return {
      diseases: data.suggestions, // List of possible diseases
      healthAssessment: data.health_assessment, // Health status of the plant
    };
  } catch (error) {
    console.error('Error analyzing plant:', error);
    return { diseases: [], healthAssessment: null };
  }
}
