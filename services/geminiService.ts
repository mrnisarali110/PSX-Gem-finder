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
    
    **IMPORTANT**: Keep the "markdownReport" concise and focused on key insights to ensure valid JSON output.
    
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
        // Explicitly set a high output limit to prevent JSON truncation
        maxOutputTokens: 65536,
        thinkingConfig: {
          // Reduce budget slightly to leave ample room for the generation
          thinkingBudget: 10000, 
        },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, enum: ["GEM", "WATCH", "TRAP", "UNKNOWN"] },
            confidence: { type: Type.NUMBER, description: "Confidence score 0-100" },
            markdownReport: { type: Type.STRING, description: "The detailed markdown analysis report." },
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

    // Parse the JSON response with error handling
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(response.text || "{}");
    } catch (parseError) {
      console.warn("Initial JSON parse failed, attempting cleanup:", parseError);
      // Attempt to clean markdown code blocks if present
      const cleanedText = response.text?.replace(/```json\n?|```/g, '').trim() || "{}";
      try {
        jsonResponse = JSON.parse(cleanedText);
      } catch (finalError) {
        console.error("Gemini Analysis JSON Parse Error:", finalError);
        console.log("Raw Text:", response.text);
        
        // Return a graceful failure object instead of crashing
        return {
           markdown: "### Analysis Error\n\nThe AI successfully analyzed the data but the response format was incomplete (Token Limit Exceeded). \n\n**Please try analyzing the stock again.**",
           verdict: "UNKNOWN",
           confidence: 0,
           financialData: [],
           companyName: stock.symbol
        };
      }
    }

    return {
      markdown: jsonResponse.markdownReport || "Analysis failed to generate text.",
      verdict: jsonResponse.verdict || "UNKNOWN",
      confidence: jsonResponse.confidence || 0,
      financialData: jsonResponse.financialData || [],
      companyName: stock.symbol
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Return a structured error result so the UI handles it gracefully
    return {
        markdown: "### Connection or API Error\n\nUnable to complete analysis at this time. Please check your internet connection or API quota.",
        verdict: "UNKNOWN",
        confidence: 0,
        financialData: [],
        companyName: stock.symbol
    };
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