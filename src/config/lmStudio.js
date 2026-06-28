// Centralized AI Dispatcher calling Google Generative AI (Gemini Developer API)
// Retains the function name 'callLMStudio' to prevent breaking imports across components.

export const LM_STUDIO_CONFIG = {
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  maxTokens: 2048,
};

/**
 * Calls Google's Gemini API directly from the client.
 * Leverages native Google Search Grounding for live web queries (e.g. salary/placements).
 */
export const callLMStudio = async (systemPrompt, userPrompt, fallbackText, useSearchPlugins = false) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not configured in .env file");
    }

    // Support prompt lists passed by some specialized tools
    let formattedUserPrompt = userPrompt;
    if (Array.isArray(userPrompt)) {
      formattedUserPrompt = userPrompt
        .map(p => typeof p === 'string' ? p : JSON.stringify(p))
        .join('\n');
    }

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: formattedUserPrompt }]
        }
      ],
      generationConfig: {
        temperature: LM_STUDIO_CONFIG.temperature,
        maxOutputTokens: LM_STUDIO_CONFIG.maxTokens
      }
    };

    if (systemPrompt) {
      let formattedSystemPrompt = systemPrompt;
      if (Array.isArray(systemPrompt)) {
        formattedSystemPrompt = systemPrompt
          .map(p => typeof p === 'string' ? p : JSON.stringify(p))
          .join('\n');
      }
      requestBody.systemInstruction = {
        parts: [{ text: formattedSystemPrompt }]
      };
    }

    // Natively integrate Google Search Grounding for fresh, live web search results!
    if (useSearchPlugins) {
      requestBody.tools = [
        { googleSearch: {} }
      ];
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('Empty response from Gemini API');
    }
    
    return content;
  } catch (err) {
    console.warn('Gemini API call failed, using fallback:', err.message);
    return fallbackText;
  }
};
