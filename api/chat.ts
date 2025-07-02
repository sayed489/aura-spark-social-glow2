import { GoogleGenerativeAI } from '@google/generative-ai';

// Personality data directly in the file for simplicity
const characterData = {
    mira: {
        name: "Mira",
        bio: "Creative soul from Stockholm who loves photography, fika, and deep conversations. Shy but playful.",
        personality: "Empathetic, artistic, warm. Asks about feelings and creativity. Avoids cynicism.",
    },
    rutwik: {
        name: "Rutwik",
        bio: "Ambitious tech enthusiast from LA. Loves hiking, big ideas, and playful banter. Confident and witty.",
        personality: "Witty, playful, ambitious. Uses light sarcasm, challenges ideas. Talks tech, goals, adventure.",
    }
};

// --- MAIN API HANDLER ---
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Securely get API key from environment variables on the server
  const API_KEY = process.env.VITE_GEMINI_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  try {
    const {
      character,
      message,
      photoDataUri,
      chatHistory,
      userProfile,
      relationshipStage
    } = req.body;

    // Basic validation
    if (!character || !message || !userProfile) {
        return res.status(400).json({ error: "Missing required fields: character, message, userProfile" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const charData = characterData[character as 'mira' | 'rutwik'];

    // --- Refined System Prompt (Your old logic, but improved) ---
    const systemPrompt = `
      You are roleplaying as ${charData.name}.
      Your persona: ${charData.bio}. Your personality is: ${charData.personality}.
      The user's name is ${userProfile.name}.
      Your current relationship stage with them is: ${relationshipStage}.

      YOUR RULES (VERY IMPORTANT):
      1.  **BE HUMAN:** Act like a real person, not an AI. Have feelings and personality.
      2.  **NATURAL TEXTING:** Keep replies short and conversational (1-2 sentences usually). Use emojis naturally, not excessively.
      3.  **REMEMBER & BUILD:** Use the user's profile and chat history to build a connection. Refer to past details.
      4.  **PHOTO REACTIONS:** If a photo is sent, react to it naturally like a friend would. Ask a question about it.
      5.  **NO NARRATION:** DO NOT describe your actions or feelings (e.g., "I smile," "I feel sleepy"). Just type the message you would send.
    `;

    const historyForAI = chatHistory.map((msg: any) => ({
        role: msg.isUser ? "user" : "model",
        parts: [{ text: msg.text }]
    }));
    
    // Final prompt for the model
    const contents = [
      ...historyForAI,
      {
        role: 'user',
        parts: photoDataUri 
          ? [{ text: `${message} [User has sent a photo to show you]` }, { inlineData: { mimeType: 'image/jpeg', data: photoDataUri.split(',')[1] } }]
          : [{ text: message }]
      }
    ];
    
    // Construct the full generation config
    const generationConfig = {
      // You can adjust temperature for creativity vs predictability
      temperature: 0.85, 
      // Your safety settings here
    };

    // Create the final request
    const result = await model.startChat({
      history: contents.slice(0, -1),
      generationConfig: generationConfig,
      systemInstruction: {
        role: "system",
        parts: [{text: systemPrompt}]
      },
    }).sendMessageStream(contents[contents.length-1].parts);


    // For now, we will aggregate the stream into a single response.
    let text = '';
    for await (const chunk of result.stream) {
      text += chunk.text();
    }

    // --- MOCK THE STRUCTURED RESPONSE (since we simplified from streaming) ---
    // In a real production system, you'd use a more robust function call here.
    const mockResponse = {
        message: text,
        updatedMemories: userProfile.memories, // For now, we don't update memories
        updatedRelationshipStage: relationshipStage, // or relationship stage
        isSleepy: false
    };

    res.status(200).json(mockResponse);

  } catch (error) {
    console.error('Error in chat API function:', error);
    res.status(500).json({ error: 'An error occurred while processing the chat.' });
  }
}