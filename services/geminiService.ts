
import { GoogleGenAI, Type } from "@google/genai";
import { BrandProfile, AdCreative, Platform, CampaignObjective, Recommendation } from "../types";

export const scanWebsite = async (url: string): Promise<BrandProfile> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this website URL: ${url}. Provide a high-level brand marketing profile. Identify core products, target demographics, and brand tone.`,
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

  const text = response.text?.trim();
  if (!text) throw new Error("AI failed to return content for website scan.");
  return { ...JSON.parse(text), url };
};

export const generateCampaignStrategy = async (
  profile: BrandProfile,
  goal: string,
  type: string
): Promise<{ platforms: Platform[], suggestedBudget: number, adAngles: string[], targetAudience: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Context: Brand ${profile.name} (${profile.summary}).
    Goal: ${goal}.
    Campaign Type: ${type}.
    
    Task:
    1. Select the 2 best advertising platforms from [Meta, Google, TikTok, LinkedIn, Pinterest, X].
    2. Suggest a daily starting budget in USD.
    3. Create 3 marketing 'angles' or hooks for the ads.
    4. Define the target audience segment in one sentence.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 16384 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedBudget: { type: Type.NUMBER },
          adAngles: { type: Type.ARRAY, items: { type: Type.STRING } },
          targetAudience: { type: Type.STRING },
        },
        required: ["platforms", "suggestedBudget", "adAngles", "targetAudience"],
      },
    },
  });

  const text = response.text?.trim();
  if (!text) throw new Error("AI failed to return strategy.");
  return JSON.parse(text);
};

export const generateCreatives = async (
  brandProfile: BrandProfile,
  platforms: Platform[],
  objective: CampaignObjective,
  angle: string
): Promise<AdCreative[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Generate 3 high-converting ad variants.
    Brand: ${brandProfile.name}.
    Context: ${brandProfile.summary}.
    Platforms: ${platforms.join(', ')}.
    Objective: ${objective}.
    Marketing Angle: ${angle}.
    
    For each variant, provide a headline, primary text, and a compelling CTA. 
    Also predict a CTR (0.01 to 0.05) based on current industry benchmarks for this niche.
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
  if (!text) throw new Error("AI failed to return creatives.");
  return JSON.parse(text);
};

export const getRecommendations = async (campaigns: any[]): Promise<Recommendation[]> => {
  if (campaigns.length === 0) return [];
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze these marketing campaigns and provide 3 optimization recommendations. 
    Campaigns: ${JSON.stringify(campaigns)}.
    Focus on Budget redistribution and Creative rotation.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 8192 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['optimization', 'budget', 'creative'] },
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
  if (!text) return [];
  return JSON.parse(text);
};
