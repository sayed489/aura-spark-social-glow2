// Important: This code is for a Vercel Serverless Function, not Firebase.
// Remove VercelRequest/VercelResponse types for compatibility if not available
// import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
// NOTE: We do not import firebase-admin here because this is not a Firebase function.

export default async function handler(
  request: any,
  response: any,
) {
  // --- Check for POST method ---
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { characterId, userMessage, chatHistory, userProfile } = request.body;
  
  // --- Securely get API Key from Vercel Environment Variables ---
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return response.status(500).json({ error: 'API key not configured' });
  }
  
  const genAI = new GoogleGenerativeAI(API_KEY);

  const characterData = {
    mira: { name: "Mira", bio: "Creative soul from Stockholm...", personality: "Empathetic, artistic, warm..." },
    rutwik: { name: "Rutwik", bio: "Ambitious tech enthusiast from LA...", personality: "Witty, playful, ambitious..." }
  };
  
  if (!characterId || !(characterId in characterData)) {
    return response.status(400).json({ error: "Invalid characterId" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const charInfo = characterData[characterId as 'mira' | 'rutwik'];
    const relationshipKey = `relationshipStage_${characterId}`;
    const currentRelationshipStage = userProfile ? userProfile[relationshipKey] : 'Stranger';

    const prompt = `
      You are ${charInfo.name}. ${charInfo.bio}
      Personality: ${charInfo.personality}
      Current relationship stage: ${currentRelationshipStage}
      User's Name: ${userProfile?.name || 'friend'}
      Chat History: ${(chatHistory || []).join('\n')}
      User's new message: "${userMessage}"

      Respond ONLY with a valid JSON object in this format:
      {
        "message": "Your response as ${charInfo.name}",
        "updatedMemories": ["list", "of", "memories"],
        "updatedRelationshipStage": "current_or_new_stage"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
    
    // Defensive: If Gemini returns invalid JSON, catch and return a safe error
    let aiResponse;
    try {
      aiResponse = JSON.parse(cleanedResponse);
    } catch (err) {
      console.error("Gemini returned invalid JSON:", cleanedResponse);
      return response.status(500).json({ error: 'AI returned invalid response. Please try again.' });
    }
    // Send the successful response back to the app
    return response.status(200).json(aiResponse);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return response.status(500).json({ error: 'Failed to get a response from the AI companion.' });
  }
}