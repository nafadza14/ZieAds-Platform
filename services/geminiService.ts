
import { GoogleGenAI, Type } from "@google/genai";
import { BrandProfile, AdCreative, Platform, CampaignObjective, CampaignType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const scanWebsite = async (url: string): Promise<BrandProfile> => {
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

  return { ...JSON.parse(response.text), url };
};

export const generateCampaignStrategy = async (
  profile: BrandProfile,
  goal: string
): Promise<{ platforms: Platform[], suggestedBudget: number, adAngles: string[] }> => {
  const prompt = `Based on this brand: ${profile.summary} and this goal: ${goal}, suggest the best 2-3 advertising platforms, a daily budget, and 3 specific ad angles.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
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

  return JSON.parse(response.text);
};

export const generateCreatives = async (
  brandProfile: BrandProfile,
  platforms: Platform[],
  objective: CampaignObjective,
  angle: string
): Promise<AdCreative[]> => {
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

  return JSON.parse(response.text);
};

export const getRecommendations = async (campaigns: any[]): Promise<any[]> => {
  if (campaigns.length === 0) return [];
  
  const prompt = `Analyze these campaigns and provide 3 marketing optimization recommendations: ${JSON.stringify(campaigns)}`;
  
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

  return JSON.parse(response.text);
};
