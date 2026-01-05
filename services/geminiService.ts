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
    
    // Handle Custom Search where price might be 0
    // We add a specific instruction for "Identification"
    const isCustomSearch = stock.price === 0;
    const priceContext = !isCustomSearch
      ? `Current Price (Ref): PKR ${stock.price}` 
      : `Current Price: UNKNOWN. Task: Find the live price.`;

    const prompt = `
    **LIVE ANALYSIS REQUEST**
    Date: ${today}
    Input Symbol/Name: ${stock.symbol}
    ${priceContext}
    
    **MANDATORY ACTIONS:**
    1.  **STRICT IDENTIFICATION**: 
        - The user input "${stock.symbol}" might be a typo, a short name, or garbage text. 
        - **Verify** if this corresponds to a listed company on the Pakistan Stock Exchange (PSX).
        - **FAIL FAST**: If the input is random text (e.g. "asdasd", "wafi"), nonsense, or NOT a real PSX company, **IMMEDIATELY** set verdict to 'UNKNOWN' and stop. Do NOT generate fake financial data.
        - If it is a valid company (e.g. "LUCK", "Meezan"), proceed to step 2.

    2.  **LIVE DATA SEARCH** (Only if Identified): 
        - Use Google Search to find the *latest* Financial Results (2024-2025) and Stock Price.
    
    3.  **VALUATION** (Only if Identified): 
        - Apply the "Gem" methodology defined in system instructions.
    
    **OUTPUT REQUIREMENTS**:
    - If the stock is valid, return "verdict" as GEM, WATCH, or TRAP.
    - If the stock is NOT found on PSX, return "verdict" as UNKNOWN.
    - **Identify the Company**: Always return the correct "officialSymbol" and "officialName" in the JSON.

    Output must be valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        systemInstruction: GEM_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        maxOutputTokens: 65536,
        thinkingConfig: {
          thinkingBudget: 10000, 
        },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, enum: ["GEM", "WATCH", "TRAP", "UNKNOWN"] },
            confidence: { type: Type.NUMBER, description: "Confidence score 0-100" },
            officialName: { type: Type.STRING, description: "The full official company name (e.g. 'Waves Corporation Limited')" },
            officialSymbol: { type: Type.STRING, description: "The correct ticker symbol (e.g. 'WAVES')" },
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
      const cleanedText = response.text?.replace(/```json\n?|```/g, '').trim() || "{}";
      try {
        jsonResponse = JSON.parse(cleanedText);
      } catch (finalError) {
        console.error("Gemini Analysis JSON Parse Error:", finalError);
        return {
           markdown: "### Analysis Error\n\nThe AI successfully analyzed the data but the response format was incomplete. \n\n**Please try analyzing the stock again.**",
           verdict: "UNKNOWN",
           confidence: 0,
           financialData: [],
           companyName: stock.symbol
        };
      }
    }

    // Use the official name found by AI if available
    const resolvedName = jsonResponse.officialName 
        ? `${jsonResponse.officialSymbol || stock.symbol} - ${jsonResponse.officialName}`
        : stock.symbol;

    return {
      markdown: jsonResponse.markdownReport || "Analysis failed to generate text.",
      verdict: jsonResponse.verdict || "UNKNOWN",
      confidence: jsonResponse.confidence || 0,
      financialData: jsonResponse.financialData || [],
      companyName: resolvedName
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
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