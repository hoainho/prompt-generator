export type TabOption = 'generate' | 'enhance' | 'history';

export type PromptPersona = 'general' | 'engineer_react' | 'artist_visual';

export interface PromptHistoryItem {
  id: string;
  prompt: string;
  type: 'idea' | 'generated' | 'enhancement_source' | 'enhanced';
  timestamp: number;
  relatedIdea?: string; // For generated prompts, to link back to the original idea
  // personaUsed?: PromptPersona; // Optional: To track which persona was active
}
