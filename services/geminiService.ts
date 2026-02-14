
import { GoogleGenAI, Type } from "@google/genai";
import { BrandProfile, AdCreative, Platform, CampaignObjective, Recommendation, BrandDNA } from "../types";

const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AdTemplateLayer {
  id: string;
  pos: [number, number];
  text: string;
  fontSize: number;
  color: string;
  font: string;
}

export interface AdTemplateLogic {
  canvas_layers: AdTemplateLayer[];
  ai_image_prompt: string;
}

export const scanWebsite = async (url: string, logoBase64?: string): Promise<BrandProfile> => {
  try {
    const ai = getAi();
    const parts: any[] = [
      { text: `
        Analyze the brand DNA for: ${url}. 
        Synthesize three core components for marketing:
        1. Core Narrative: What is their core story and unique value proposition?
        2. Audience Psychology: What are the emotional triggers and behavioral signals of their customers?
        3. Visual Identity: What aesthetic direction and color theory do they project?
        
        If a logo image is provided, incorporate its visual style, weight, and color balance into your analysis.
        Return basic metadata like business_name, primary_colors, tone, products, and target audiences.
      `}
    ];

    if (logoBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: logoBase64.split(',')[1] || logoBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        thinkingConfig: { thinkingBudget: 16384 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            business_name: { type: Type.STRING },
            summary: { type: Type.STRING },
            tone: { type: Type.STRING },
            primary_color: { type: Type.STRING },
            secondary_color: { type: Type.STRING },
            products: { type: Type.ARRAY, items: { type: Type.STRING } },
            audiences: { type: Type.ARRAY, items: { type: Type.STRING } },
            dna: {
              type: Type.OBJECT,
              properties: {
                narrative: { type: Type.STRING },
                audience: { type: Type.STRING },
                visuals: { type: Type.STRING }
              },
              required: ["narrative", "audience", "visuals"]
            }
          },
          required: ["business_name", "summary", "tone", "primary_color", "secondary_color", "products", "audiences", "dna"],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error("AI failed to return content for DNA analysis.");
    const data = JSON.parse(text);
    
    return { 
      name: data.business_name,
      summary: data.summary,
      description: data.summary,
      tone: data.tone,
      primaryColor: data.primary_color || '#14B8A6',
      secondaryColor: data.secondary_color || '#1E293B',
      colors: [data.primary_color, data.secondary_color],
      products: data.products,
      audiences: data.audiences,
      url,
      dna: data.dna,
      logoUrl: logoBase64 || undefined
    };
  } catch (error) {
    console.error("Error in scanWebsite:", error);
    throw error;
  }
};

export const generateAdCreativeComplex = async (
  brandProfile: BrandProfile,
  platform: Platform,
  objective: CampaignObjective,
  goal: string
): Promise<AdCreative[]> => {
  try {
    const ai = getAi();
    const prompt = `
      Context: Brand ${brandProfile.name} (${brandProfile.summary}). 
      Goal: ${goal}.
      Objective: ${objective}.
      Platform: ${platform}.
      
      Task: Generate 3 high-converting ad plans (variants).
      For each variant provide:
      - A compelling headline.
      - A high-engagement primary text.
      - A strong CTA.
      - A detailed image generation prompt (visual description) that aligns with the Brand DNA: ${brandProfile.dna?.visuals}.
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
              imagePrompt: { type: Type.STRING },
              predictedCTR: { type: Type.NUMBER },
            },
            required: ["headline", "primaryText", "cta", "imagePrompt", "predictedCTR"],
          }
        },
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error("AI failed to return creatives.");
    return JSON.parse(text).map((c: any) => ({ ...c, platform }));
  } catch (error) {
    console.error("Error in generateAdCreativeComplex:", error);
    throw error;
  }
};

export const generateImageForAd = async (prompt: string): Promise<string> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `A professional advertising image, high definition, no text in image. Subject: ${prompt}` }] },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Image gen error:", error);
    return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800";
  }
};

export const generateDynamicAdTemplateLogic = async (
  productName: string,
  style: string,
  brandColors: string[]
): Promise<AdTemplateLogic> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Synthesize a high-converting dynamic ad composition logic for "${productName}" using the "${style}" aesthetic style.
      Incorporate these brand colors: ${brandColors.join(', ')}.
      The canvas dimensions are 1000x1000 pixels.
      Provide a list of text layers (canvas_layers) with their spatial positions [x, y], font sizing, and coloring.
      Also provide a descriptive ai_image_prompt for the background image that complements the text layout.`,
      config: {
        thinkingConfig: { thinkingBudget: 8192 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            canvas_layers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  pos: { 
                    type: Type.ARRAY, 
                    items: { type: Type.NUMBER },
                    minItems: 2,
                    maxItems: 2
                  },
                  text: { type: Type.STRING },
                  fontSize: { type: Type.NUMBER },
                  color: { type: Type.STRING },
                  font: { type: Type.STRING },
                },
                required: ["id", "pos", "text", "fontSize", "color", "font"],
              }
            },
            ai_image_prompt: { type: Type.STRING }
          },
          required: ["canvas_layers", "ai_image_prompt"],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error("AI failed to synthesize template logic.");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error in generateDynamicAdTemplateLogic:", error);
    throw error;
  }
};

export const getRecommendations = async (campaigns: any[]): Promise<Recommendation[]> => {
  if (campaigns.length === 0) return [];
  try {
    const ai = getAi();
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
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    return [];
  }
};
