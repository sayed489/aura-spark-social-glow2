export interface ChatResponse {
  message: string;
  updatedMemories: any[];
  updatedRelationshipStage: string;
  isSleepy: boolean;
}

export async function generateChatResponse(
  character: 'mira' | 'rutwik',
  userMessage: string,
  userProfile: any,
  chatHistory: any[],
  relationshipStage: string,
  photoBase64?: string
): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        character,
        message: userMessage,
        photoDataUri: photoBase64,
        chatHistory,
        userProfile,
        relationshipStage,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from the server.');
    }

    const data: ChatResponse = await response.json();
    return data;

  } catch (error) {
    console.error("Error calling chat API:", error);
    // Return a structured error response
    return {
      message: "Sorry, I'm having a bit of trouble connecting right now. Let's try that again in a moment.",
      updatedMemories: userProfile && userProfile.memories ? userProfile.memories : [],
      updatedRelationshipStage: relationshipStage,
      isSleepy: false,
    } as ChatResponse;
  }
}