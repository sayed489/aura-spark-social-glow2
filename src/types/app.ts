// Types for chat API responses

export interface ChatResponse {
  message: string;
  updatedMemories: any[];
  updatedRelationshipStage: string;
  isSleepy: boolean;
}