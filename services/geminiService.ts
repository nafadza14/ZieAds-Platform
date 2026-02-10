
import { GoogleGenAI, Type } from "@google/genai";
import { BrandProfile, AdCreative, Platform, CampaignObjective, Recommendation } from "../types";

// Note: GoogleGenAI instance is initialized per-request to ensure the most recent API key from process.env.API_KEY is used.

export const scanWebsite = async (url: string): Promise<BrandProfile> => {
  // Fix: Initialize GoogleGenAI right before use to capture the injected API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this website URL: ${url}. Provide a brand marketing profile in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          summary: { type: Type.STRING },
          tone: { type: Type.STRING },
          colors: { type: Type.ARRAY, items: { type: Type.STRING } },
          products: { type: Type.ARRAY, items: { type: Type.STRING } },
          audiences: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["name", "summary", "tone", "colors", "products", "audiences"],
      },
    },
  });

  // Fix: Safely handle response text using property access and trim().
  const text = response.text?.trim();
  if (!text) throw new Error("AI failed to return content for website scan.");
  return { ...JSON.parse(text), url };
};

export const generateCampaignStrategy = async (
  profile: BrandProfile,
  goal: string
): Promise<{ platforms: Platform[], suggestedBudget: number, adAngles: string[] }> => {
  // Fix: Initialize GoogleGenAI right before use.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Based on this brand: ${profile.summary} and this goal: ${goal}, suggest the best 2-3 advertising platforms, a daily budget, and 3 specific ad angles.`;

  const response = await ai.models.generateContent({
    // Fix: Upgrade to gemini-3-pro-preview for complex reasoning tasks.
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      // Fix: Add thinking budget for complex reasoning tasks.
      thinkingConfig: { thinkingBudget: 16384 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedBudget: { type: Type.NUMBER },
          adAngles: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["platforms", "suggestedBudget", "adAngles"],
      },
    },
  });

  const text = response.text?.trim();
  if (!text) throw new Error("AI failed to return content for campaign strategy.");
  return JSON.parse(text);
};

export const generateCreatives = async (
  brandProfile: BrandProfile,
  platforms: Platform[],
  objective: CampaignObjective,
  angle: string
): Promise<AdCreative[]> => {
  // Fix: Initialize GoogleGenAI right before use.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Create 3 high-converting ad variants for ${platforms.join(', ')} campaigns.
    Objective: ${objective}.
    Angle: ${angle}.
    Brand: ${brandProfile.summary}.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            primaryText: { type: Type.STRING },
            cta: { type: Type.STRING },
            predictedCTR: { type: Type.NUMBER },
          },
          required: ["headline", "primaryText", "cta", "predictedCTR"],
        }
      },
    },
  });

  const text = response.text?.trim();
  if (!text) throw new Error("AI failed to return content for creative generation.");
  return JSON.parse(text);
};

export const getRecommendations = async (campaigns: any[]): Promise<Recommendation[]> => {
  if (campaigns.length === 0) return [];
  
  // Fix: Initialize GoogleGenAI right before use.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze these campaigns and provide 3 marketing optimization recommendations: ${JSON.stringify(campaigns)}`;
  
  const response = await ai.models.generateContent({
    // Fix: Upgrade to gemini-3-pro-preview for advanced performance reasoning.
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      // Fix: Add thinking budget for complex reasoning.
      thinkingConfig: { thinkingBudget: 16384 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            impact: { type: Type.STRING },
          },
          required: ["id", "type", "title", "description", "impact"],
        }
      },
    },
  });

  const text = response.text?.trim();
  if (!text) throw new Error("AI failed to return content for recommendations.");
  return JSON.parse(text);
};
