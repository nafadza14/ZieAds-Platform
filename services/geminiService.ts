
import { GoogleGenAI, Type } from "@google/genai";
import { BrandProfile, AdCreative, Platform, CampaignObjective, Recommendation } from "../types";

export const scanWebsite = async (url: string): Promise<BrandProfile> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the text and meta-tags of this URL: ${url}. Return a marketing profile in JSON format.
    Extract:
    1. business_name: The company name.
    2. description: A compelling core value proposition (max 800 chars).
    3. primary_color: A detect primary brand HEX color.
    4. secondary_color: A detect secondary brand HEX color.
    5. tone: Brand voice personality.
    6. products: List of key products or services.
    7. audiences: Potential target audience segments.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          business_name: { type: Type.STRING },
          description: { type: Type.STRING },
          tone: { type: Type.STRING },
          primary_color: { type: Type.STRING },
          secondary_color: { type: Type.STRING },
          products: { type: Type.ARRAY, items: { type: Type.STRING } },
          audiences: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["business_name", "description", "tone", "primary_color", "secondary_color", "products", "audiences"],
      },
    },
  });

  const text = response.text?.trim();
  if (!text) throw new Error("AI failed to return content for website scan.");
  const data = JSON.parse(text);
  
  return { 
    name: data.business_name,
    summary: data.description,
    description: data.description,
    tone: data.tone,
    primaryColor: data.primary_color || '#14B8A6',
    secondaryColor: data.secondary_color || '#1E293B',
    colors: [data.primary_color, data.secondary_color],
    products: data.products,
    audiences: data.audiences,
    url 
  };
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
