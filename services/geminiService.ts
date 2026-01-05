import { GoogleGenAI, Type } from "@google/genai";
import { Stock, AnalysisResult } from "../types";
import { GEM_SYSTEM_INSTRUCTION } from "../constants";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeStockWithGemini = async (
  stock: Stock
): Promise<AnalysisResult> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const prompt = `
    **LIVE ANALYSIS REQUEST**
    Date: ${today}
    Target Security: ${stock.symbol} (${stock.name}) - Sector: ${stock.sector}
    Current Price (Ref): PKR ${stock.price}
    
    **MANDATORY ACTIONS:**
    1.  **LIVE SEARCH**: Use Google Search to find the *very latest* financial results (Quarterly or Annual) for 2024/2025. Do NOT rely on training data.
    2.  **VERIFY DATE**: Explicitly mention the date of the latest financial report found in the output.
    3.  **EXTRACT**: Get EPS, Revenue, and Dividend data for the last 5 years up to present day.
    4.  **ANALYZE**: Apply the "Gem" methodology defined in system instructions.
    
    Output must be valid JSON matching the provided schema.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        systemInstruction: GEM_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        thinkingConfig: {
          thinkingBudget: 32768, 
        },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, enum: ["GEM", "WATCH", "TRAP", "UNKNOWN"] },
            confidence: { type: Type.NUMBER, description: "Confidence score 0-100" },
            markdownReport: { type: Type.STRING, description: "The full detailed markdown analysis report." },
            financialData: {
              type: Type.ARRAY,
              description: "Historical financial data extracted or estimated from reports",
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING },
                  eps: { type: Type.NUMBER },
                  peRatio: { type: Type.NUMBER },
                  revenue: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    // Parse the JSON response
    const jsonResponse = JSON.parse(response.text || "{}");

    return {
      markdown: jsonResponse.markdownReport || "Analysis failed to generate text.",
      verdict: jsonResponse.verdict || "UNKNOWN",
      confidence: jsonResponse.confidence || 0,
      financialData: jsonResponse.financialData || [],
      companyName: stock.symbol
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const getMarketPulse = async (stock: Stock): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: `Search for the latest material information, board meeting announcements, and dividend declarations for ${stock.name} (${stock.symbol}) PSX in the last 90 days. Summarize in 3 bullet points.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    let sources = "";
    if (groundingChunks) {
      sources = "\n\n**Verified News Sources:**\n" + groundingChunks
        .map((chunk: any) => chunk.web ? `- [${chunk.web.title}](${chunk.web.uri})` : "")
        .filter((s: string) => s !== "")
        .slice(0, 3)
        .join("\n");
    }

    return (text || "No recent material news found.") + sources;

  } catch (error) {
    console.warn("Search Grounding Error:", error);
    return "Could not fetch real-time market pulse.";
  }
};