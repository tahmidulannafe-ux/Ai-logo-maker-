import { GoogleGenAI } from "@google/genai";

// We need to declare the window.aistudio interface
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

let genAI: GoogleGenAI | null = null;

export const getGenAI = async () => {
  // Check if we need to prompt for a key
  if (window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }

  // Use API_KEY if available (injected by platform for paid models), otherwise fallback to GEMINI_API_KEY
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  
  return new GoogleGenAI({ apiKey: apiKey });
};

export const generateLogo = async (prompt: string, size: "1K" | "2K" | "4K") => {
  const ai = await getGenAI();
  const model = ai.models.getGenerativeModel({ model: "gemini-3-pro-image-preview" });
  
  const response = await model.generateContent({
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size,
      },
    },
  });

  // Extract image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

export const generateVideo = async (
  imageBase64: string, 
  prompt: string, 
  aspectRatio: "16:9" | "9:16" = "16:9"
) => {
  const ai = await getGenAI();
  
  // Clean base64 string if needed (remove data:image/png;base64, prefix)
  const base64Data = imageBase64.split(',')[1] || imageBase64;
  const mimeType = imageBase64.match(/data:([^;]+);/)?.[1] || "image/png";

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || "Animate this logo",
    image: {
      imageBytes: base64Data,
      mimeType: mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p', // Veo fast supports 720p or 1080p
      aspectRatio: aspectRatio,
    }
  });

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("No video generated");

  return videoUri;
};

export const fetchVideoUrl = async (uri: string) => {
    // We need to fetch the video with the API key header
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
    
    const response = await fetch(uri, {
        method: 'GET',
        headers: {
            'x-goog-api-key': apiKey,
        },
    });
    
    if (!response.ok) throw new Error("Failed to fetch video");
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}
