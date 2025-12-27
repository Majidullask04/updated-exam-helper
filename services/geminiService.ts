import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Quiz, Flashcard, StudyTask, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-3-flash-preview";

export const chatWithTutor = async (
  history: ChatMessage[],
  message: string,
  attachment?: { mimeType: string; data: string }
): Promise<{ text: string; groundingMetadata?: any }> => {
  // Format history for Gemini API
  const formattedHistory = history.map(msg => {
    const parts: any[] = [{ text: msg.text }];
    if (msg.attachment) {
      parts.push({ inlineData: msg.attachment });
    }
    return {
      role: msg.role,
      parts: parts
    };
  });

  const chat = ai.chats.create({
    model: modelName,
    history: formattedHistory,
    config: {
      systemInstruction: "You are Examaid Pro, an expert, encouraging, and patient AI study tutor. Your goal is to help students understand complex topics, solve problems, and prepare for exams. Be concise but thorough. Use Google Search when you need to provide up-to-date information, facts, or resources.",
      tools: [{ googleSearch: {} }],
    },
  });

  const parts: any[] = [{ text: message }];
  if (attachment) {
    parts.push({ inlineData: attachment });
  }

  // Send message with text and optional image
  const response = await chat.sendMessage({ message: parts });
  
  return {
    text: response.text || "",
    groundingMetadata: response.candidates?.[0]?.groundingMetadata
  };
};

export const generateQuiz = async (topic: string, difficulty: string): Promise<Quiz> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"]
        }
      }
    },
    required: ["title", "questions"]
  };

  const prompt = `Generate a ${difficulty} level multiple-choice quiz about "${topic}". Create 5 questions.`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text) as Quiz;
};

export const generateFlashcards = async (topicOrText: string): Promise<Flashcard[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        front: { type: Type.STRING, description: "The term or question on the front of the card" },
        back: { type: Type.STRING, description: "The definition or answer on the back of the card" }
      },
      required: ["front", "back"]
    }
  };

  const prompt = `Create a set of 8 high-quality study flashcards based on the following topic or text: "${topicOrText}". Focus on key concepts and definitions.`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

   if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text) as Flashcard[];
};

export const generateStudyPlan = async (subject: string, days: number, hoursPerDay: number): Promise<StudyTask[]> => {
   const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        day: { type: Type.STRING, description: "e.g., Day 1" },
        topics: { type: Type.ARRAY, items: { type: Type.STRING } },
        duration: { type: Type.STRING, description: "Estimated time breakdown" }
      },
      required: ["day", "topics", "duration"]
    }
  };

  const prompt = `Create a ${days}-day study plan for ${subject}, assuming ${hoursPerDay} hours of study per day. Structure it logically covering key areas.`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text) as StudyTask[];
}
