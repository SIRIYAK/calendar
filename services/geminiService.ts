import { GoogleGenAI, Type } from "@google/genai";
import { ProjectTask, CalendarEvent } from "../types";

// Helper to format date without time
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const generateSmartSchedule = async (
  tasks: ProjectTask[],
  targetDate: Date
): Promise<CalendarEvent[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const taskListString = tasks.map(t => 
    `- ID: ${t.id}, Project: ${t.project}, Type: ${t.taskType}, Desc: ${t.description}`
  ).join('\n');

  const dateStr = formatDate(targetDate);

  const prompt = `
    I need to schedule the following project tasks for the workday starting on ${dateStr}.
    Please assign them to realistic time slots between 08:00 and 18:00.
    Prioritize meetings and trainings for mid-day.
    Keep development blocks contiguous if possible.
    
    Tasks:
    ${taskListString}
    
    Return a JSON array of events.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              taskId: { type: Type.STRING },
              title: { type: Type.STRING },
              startTime: { type: Type.STRING, description: "ISO 8601 string for start time" },
              endTime: { type: Type.STRING, description: "ISO 8601 string for end time" },
              description: { type: Type.STRING }
            },
            required: ["taskId", "title", "startTime", "endTime"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const generatedData = JSON.parse(jsonText);

    // Map response back to CalendarEvent objects
    const newEvents: CalendarEvent[] = generatedData.map((item: any) => {
      // Find original task to preserve project metadata
      const originalTask = tasks.find(t => t.id === item.taskId);
      
      return {
        id: crypto.randomUUID(),
        title: item.title,
        start: new Date(item.startTime),
        end: new Date(item.endTime),
        project: originalTask ? originalTask.project : 'AI Generated',
        description: item.description,
        type: 'ai-generated'
      };
    });

    return newEvents;

  } catch (error) {
    console.error("Gemini Scheduling Error:", error);
    throw error;
  }
};
