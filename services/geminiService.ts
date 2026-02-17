
import { GoogleGenAI, Type } from "@google/genai";
import { BrandProfile, AdCreative, Platform, CampaignObjective, Recommendation, BrandDNA } from "../types";

// Always use process.env.API_KEY and named parameter for initialization
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface CanvasLayer {
  id: string;
  type: 'text' | 'button';
  content: string;
  position: { x_percent: number; y_percent: number };
  style: {
    font?: string;
    size?: string;
    color?: string;
    align?: string;
    bg_color?: string;
    text_color?: string;
    border_radius?: string;
  };
}

export interface HybridAdCreative {
  ai_layer: {
    nano_banana_prompt: string;
    negative_prompt: string;
  };
  canvas_layers: CanvasLayer[];
  predictedCTR: number;
}

export interface AdTemplateLogic {
  ai_image_prompt: string;
  canvas_layers: {
    id: string;
    pos: [number, number];
    text: string;
    fontSize: number;
    color: string;
    font: string;
  }[];
}

export const scanWebsite = async (url: string, logoBase64?: string): Promise<BrandProfile> => {
  try {
    const ai = getAi();
    const parts: any[] = [
      { text: `
        Analyze the brand DNA for: ${url}. 
        Synthesize three core components for marketing:
        1. Core Narrative: What is their core story and unique value proposition? Use this to create powerful taglines.
        2. Audience Psychology: What are the emotional triggers and behavioral signals of their customers?
        3. Visual Identity: What aesthetic direction, color theory, and photographic style do they project?
        
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

export const generateHybridAdCreative = async (
  brandProfile: BrandProfile,
  platform: string,
  productName: string,
  coreBenefit: string
): Promise<HybridAdCreative[]> => {
  try {
    const ai = getAi();
    const prompt = `
      Project: ZieAds AI Ad Poster Generator & Editor (Hybrid AI-Canvas)
      Role: Creative Director AI specializing in layout composition and visual consistency.
      
      Input Context:
      - Brand: ${brandProfile.name}
      - Tone: ${brandProfile.tone}
      - Colors: ${brandProfile.colors?.join(', ') || brandProfile.primaryColor}
      - Product: ${productName}
      - Core Benefit: ${coreBenefit}
      - Platform: ${platform}
      
      Instructions:
      1. Analyze Brand DNA: ${brandProfile.dna?.narrative} | ${brandProfile.dna?.visuals}.
      2. Style Transfer: Match the 'Sas Venture' aesthetic (modern, minimalist, tech-focused, cinematic lighting).
      3. AI Layer: Create a background prompt focusing on abstract shapes, professional lighting, and a clean product placement area.
      4. Canvas Layers: Define NON-OVERLAPPING coordinates (x, y) for headline, sub-headline, and CTA.
      
      Return 3 high-converting variations.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              ai_layer: {
                type: Type.OBJECT,
                properties: {
                  nano_banana_prompt: { type: Type.STRING, description: "Detailed background art prompt focusing on lighting and textures" },
                  negative_prompt: { type: Type.STRING, description: "Should include: text, letters, messy fonts" }
                },
                required: ["nano_banana_prompt", "negative_prompt"]
              },
              canvas_layers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING },
                    content: { type: Type.STRING },
                    position: {
                      type: Type.OBJECT,
                      properties: {
                        x_percent: { type: Type.NUMBER },
                        y_percent: { type: Type.NUMBER }
                      },
                      required: ["x_percent", "y_percent"]
                    },
                    style: {
                      type: Type.OBJECT,
                      properties: {
                        font: { type: Type.STRING },
                        size: { type: Type.STRING },
                        color: { type: Type.STRING },
                        align: { type: Type.STRING },
                        bg_color: { type: Type.STRING },
                        text_color: { type: Type.STRING },
                        border_radius: { type: Type.STRING }
                      }
                    }
                  },
                  required: ["id", "type", "content", "position", "style"]
                }
              },
              predictedCTR: { type: Type.NUMBER }
            },
            required: ["ai_layer", "canvas_layers", "predictedCTR"]
          }
        }
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error("AI failed to return hybrid creatives.");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error in generateHybridAdCreative:", error);
    throw error;
  }
};

export const generateImageForAd = async (prompt: string, brandName?: string): Promise<string> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: `Professional ad background in 'Sas Venture' minimalist aesthetic. 
            NO TEXT, NO LETTERS, NO WORDS.
            Focus: ${prompt}.
            Negative: text, words, letters, blurry fonts, messy layout, distorted logos.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      },
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data returned from Nano Banana Pro");
  } catch (error) {
    console.error("Image gen error:", error);
    return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800";
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

export const generateDynamicAdTemplateLogic = async (
  productName: string,
  style: string,
  colors: string[]
): Promise<AdTemplateLogic> => {
  try {
    const ai = getAi();
    const prompt = `
      Task: Generate a high-fidelity dynamic ad template design system for marketing.
      Product Name: ${productName}
      Aesthetic Style: ${style}
      Brand Colors to incorporate: ${colors.join(', ')}
      
      Generate a JSON object containing:
      1. ai_image_prompt: A very detailed text-to-image prompt for the background layer. Focus on textures, lighting, and mood. Ensure NO TEXT is requested in the image.
      2. canvas_layers: An array of text-based design elements. 
         Each element must have:
         - id: (e.g., "headline", "tagline", "cta")
         - pos: [x, y] coordinates where 0 is left/top and 1000 is right/bottom.
         - text: The copy for that element.
         - fontSize: A size value on the same 0-100 scale (0-1000 range).
         - color: Hex color code.
         - font: Font family name.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ai_image_prompt: { type: Type.STRING },
            canvas_layers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  pos: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER }
                  },
                  text: { type: Type.STRING },
                  fontSize: { type: Type.NUMBER },
                  color: { type: Type.STRING },
                  font: { type: Type.STRING }
                },
                required: ["id", "pos", "text", "fontSize", "color", "font"]
              }
            }
          },
          required: ["ai_image_prompt", "canvas_layers"]
        }
      }
    });

    const text = response.text?.trim();
    if (!text) throw new Error("AI failed to return ad template logic.");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error in generateDynamicAdTemplateLogic:", error);
    throw error;
  }
};
