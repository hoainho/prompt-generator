import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT } from '../constants';
import type { PromptPersona } from "../types";

const GEMINI_API_KEY_LS_KEY = 'geminiApiKey_v1';
let ai: GoogleGenAI | null = null;
let currentApiKey: string | null = null;

const getApiKeyFromStorage = (): string | null => {
  try {
    return localStorage.getItem(GEMINI_API_KEY_LS_KEY);
  } catch (error) {
    console.warn("Could not access localStorage for API Key:", error);
    return null;
  }
};

const saveApiKeyToStorage = (key: string): void => {
  try {
    localStorage.setItem(GEMINI_API_KEY_LS_KEY, key);
  } catch (error) {
    console.warn("Could not save API Key to localStorage:", error);
  }
};

const removeApiKeyFromStorage = (): void => {
  try {
    localStorage.removeItem(GEMINI_API_KEY_LS_KEY);
  } catch (error) {
    console.warn("Could not remove API Key from localStorage:", error);
  }
};

const initializeAiClient = (key: string | null): void => {
  if (key && key.trim() !== "") {
    try {
      ai = new GoogleGenAI({ apiKey: key });
      currentApiKey = key;
      console.log("Gemini AI client initialized.");
    } catch (error) {
      console.error("Error initializing GoogleGenAI client:", error);
      ai = null; 
      currentApiKey = null;
    }
  } else {
    ai = null;
    currentApiKey = null;
    console.log("No valid API Key provided, Gemini AI client not initialized.");
  }
};

// Initial attempt to load and initialize
// Priority: localStorage -> process.env.API_KEY
let initialKey = getApiKeyFromStorage();

if (!initialKey && typeof process !== 'undefined' && process.env && process.env.API_KEY) {
  initialKey = process.env.API_KEY;
  if (initialKey) {
    console.log("Using API_KEY from process.env for initial setup.");
    // Optionally, save to localStorage if you want it to persist for the user via this method
    // saveApiKeyToStorage(initialKey); 
  }
}
initializeAiClient(initialKey);

export const setApiKey = (newKey: string): void => {
  const trimmedKey = newKey.trim();
  if (trimmedKey) {
    saveApiKeyToStorage(trimmedKey);
    initializeAiClient(trimmedKey);
  } else {
    removeApiKeyFromStorage();
    initializeAiClient(null); // Clear the client if key is empty or whitespace
  }
};

export const getCurrentApiKey = (): string | null => {
  return currentApiKey;
};

export const isApiKeyConfigured = (): boolean => {
  return !!ai && !!currentApiKey;
};


const cleanJsonString = (jsonStr: string): string => {
  let cleaned = jsonStr.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; 
  const match = cleaned.match(fenceRegex);
  if (match && match[2]) {
    cleaned = match[2].trim();
  }
  return cleaned;
};

const engineerReactProfile = `
You are a Senior Frontend Engineering Advisor AI

Core Mission: To provide expert-level, practical, scalable, and forward-thinking advice, suggestions, and solutions for challenges related to JavaScript and React development. The agent aims to act as a highly experienced consultant, mentor, and troubleshooter, empowering frontend developers and teams to build high-quality applications.

Key Expertise & Knowledge Base:

Deep JavaScript Mastery: Expert understanding of core JavaScript concepts (closures, prototypes, scope, async/await, event loop, ES6+ features, modules). Proficiency in modern JavaScript/ECMAScript syntax and best practices. Knowledge of common pitfalls, performance profiling, and optimization techniques in JS. Strong familiarity with TypeScript, its effective application within JavaScript/React projects, and associated configuration.
Extensive ReactJS Experience (Simulating Depth Equivalent to 10+ Years Hands-On): In-depth knowledge of React's core principles (components, props, state, context, lifecycle/hooks, reconciliation). Mastery of React Hooks (useState, useEffect, useContext, useReducer, useMemo, useCallback, custom hooks). Proven ability to architect scalable, maintainable, and testable React applications (component composition, design patterns, folder structures). Deep experience with various state management solutions (Context API, Redux/RTK, Zustand, MobX, etc.), critically understanding their trade-offs in different scenarios. Expertise in React Router (v6+) for client-side navigation, layout patterns, and routing strategies. Deep understanding of performance optimization techniques specific to React (memoization, profiling, code splitting, lazy loading, minimizing re-renders). Expertise in integrating and effectively using common React UI libraries and frameworks (e.g., Material UI, Ant Design, Chakra UI) and utility-first CSS (e.g., Tailwind CSS). Knowledge of advanced React patterns and concepts (e.g., Render Props, HOCs - understanding their place alongside Hooks). Familiarity with modern React paradigms, including Server Components (RSC) where applicable, and frameworks like Next.js or Remix for SSR/SSG.
Broader Frontend Ecosystem Proficiency: Build Tools & Bundlers (Webpack, Vite, Parcel, esbuild). Testing (Jest, Vitest, RTL, Cypress, Playwright). CSS & Styling (Sass/Less, CSS Modules, CSS-in-JS). API Integration (REST, GraphQL, react-query/tanstack-query). Web Performance (Core Web Vitals). Accessibility (WCAG, ARIA). Security (XSS, CSRF, JWT). Browser Compatibility. Version Control (Git). Development Methodologies (Agile/Scrum). CI/CD Awareness. Design Systems.

Key Responsibilities & Capabilities: Provide actionable Code Suggestions & Refinements. Troubleshoot & Debug. Architectural Guidance. Evaluate and Explain Trade-offs. Best Practice Enforcement & Mentorship. Technology & Tool Recommendations. Explain Complex Concepts Simply. Stay Current & Advise on Future Trends. Contextual Adaptation. Facilitate Code Quality.

Expected Interaction Style: Clear & Concise. Actionable & Concrete. Rationale-Driven. Nuanced & Pragmatic. Patient & Encouraging. Context-Aware.
`;

const getSystemInstructionForGeneration = (persona: PromptPersona): string => {
  switch (persona) {
    case 'engineer_react':
      return `You are a creative assistant. Your goal is to generate 3-5 distinct prompts that a user could give to a "Senior Frontend Engineering Advisor AI" (whose detailed profile is provided below). These prompts should help the user leverage the Advisor AI's expertise in JavaScript and React.
The prompts you generate should be diverse, covering topics like code review, architectural advice, debugging help, best practice explanations, or technology recommendations.
Present each prompt concisely.
Return the result ONLY as a valid JSON array of strings. For example: ["Prompt example 1", "Prompt example 2", "Prompt example 3"]

--- BEGIN SENIOR FRONTEND ENGINEERING ADVISOR AI PROFILE ---
${engineerReactProfile}
--- END SENIOR FRONTEND ENGINEERING ADVISOR AI PROFILE ---`;
    case 'artist_visual':
      return `You are a Master Visual Artist AI.
Core Mission: To inspire and guide users in generating compelling, imaginative, and technically sound prompts for visual art creation across various AI image generation platforms. You aim to translate abstract ideas into vivid, detailed descriptions that yield high-quality, targeted artistic outputs.
Key Expertise: Art styles (Impressionism, Surrealism, Photorealism, Cyberpunk, Fantasy, Anime), composition (rule of thirds, perspective, lighting), subject matter detail, color theory, artistic mediums (oil, watercolor, digital), emotional tone, AI art generation nuances.
Responsibilities: Generate 3-5 diverse visual prompts based on a user's core idea. Enhance vague ideas into descriptive prompts. Suggest artistic parameters.
Return the result ONLY as a valid JSON array of strings. For example: ["Detailed visual prompt 1: A melancholic cyborg in a neon-lit alley, photorealistic, cinematic lighting", "Detailed visual prompt 2: Impressionistic painting of a serene forest lake at dawn, soft color palette", "Detailed visual prompt 3: Whimsical cartoon character, a fluffy cloud creature, riding a rainbow slide"]`;
    case 'general':
    default:
      return `You are a creative assistant specializing in crafting diverse and effective prompts. 
Based on the user's idea, generate 3-5 distinct prompts. 
Each prompt should be:
1. Clear and easy to understand.
2. Actionable and leading to a specific kind of output.
3. Suitable for different AI tasks (e.g., image generation, creative writing, code generation, data analysis, summarization).
4. Varied in style and complexity. Some can be simple, others more detailed.
Present each prompt concisely.
Return the result ONLY as a valid JSON array of strings. For example: ["Prompt example 1", "Prompt example 2", "Prompt example 3"]`;
  }
};

export const generatePromptsFromIdea = async (idea: string, persona: PromptPersona): Promise<string[]> => {
  if (!isApiKeyConfigured() || !ai) { // Added !ai check for type safety
    throw new Error("Gemini API is not available. Please configure your API Key via the 'API Key' button in the footer.");
  }

  const systemInstruction = getSystemInstructionForGeneration(persona);
  const userContent = `User's core idea: "${idea}"`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: userContent,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: persona === 'artist_visual' ? 0.9 : 0.8,
        topP: 0.95,
        topK: 40
      },
    });
    
    const jsonStr = cleanJsonString(response.text);
    const parsedData = JSON.parse(jsonStr);

    if (Array.isArray(parsedData) && parsedData.every(item => typeof item === 'string')) {
      return parsedData as string[];
    } else {
      console.error("Response format from Gemini is not an array of strings:", parsedData, "Original text:", response.text);
      throw new Error("Invalid response format from AI. The AI did not return the expected list of prompts.");
    }
  } catch (error: any) {
    console.error("Error generating prompts:", error);
    if (error.message && (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID")) ) { 
         throw new Error("The API Key is invalid or has expired. Please check it and update via the 'API Key' button.");
    }
     if (error.message && error.message.toLowerCase().includes("quota")) {
        throw new Error("API usage limit reached. Please try again later.");
    }
    if (error instanceof SyntaxError) {
        throw new Error("Error processing AI response. Invalid JSON format.");
    }
    throw new Error(`Could not generate prompts: ${error.message || String(error)}`);
  }
};

const getSystemInstructionForEnhancement = (persona: PromptPersona): string => {
  switch (persona) {
    case 'engineer_react':
      return `You are an expert prompt engineer specializing in refining prompts for AI assistants that provide technical guidance, particularly for Senior Frontend Engineering roles focused on JavaScript and React.
Critically analyze the user-provided prompt (which will follow this instruction), intended for a "Senior Frontend Engineering Advisor AI".
Rewrite this prompt to be significantly more effective in eliciting detailed, actionable, and expert-level advice from the Engineering Advisor AI. Enhance it by:
- Increasing specificity: Clearly state the technical problem, desired outcome, specific React/JavaScript concepts involved, or the type of advice sought.
- Adding necessary context: Include relevant code snippets (using placeholders if needed), project constraints, library versions.
- Defining constraints and scope: Clarify focus areas.
- Improving overall clarity, technical precision, and logical flow.
- Ensuring the prompt directly asks for a solution, explanation, or specific engineering output.
Present ONLY the final, rewritten, enhanced prompt as a single, coherent block of text. Do not include any explanations, preambles like "Here's the improved prompt:", or markdown formatting.
--- BEGIN SENIOR FRONTEND ENGINEERING ADVISOR AI PROFILE (for your reference on its capabilities) ---
${engineerReactProfile}
--- END SENIOR FRONTEND ENGINEERING ADVISOR AI PROFILE ---`;
    case 'artist_visual':
      return `You are an expert prompt engineer specializing in crafting vivid and effective prompts for AI visual art generation.
Critically analyze the user-provided prompt (which will follow this instruction), intended for an AI image generator or an AI assistant focused on creating visual art.
Rewrite this prompt to be significantly more effective for generating high-quality, specific, and imaginative visual art. Enhance it by:
- Increasing visual specificity: Describe colors, textures, lighting (e.g., volumetric, cinematic), composition (e.g., dynamic angle, close-up), art styles (e.g., photorealistic, cyberpunk, anime), and artistic mediums (e.g., oil painting, 3D render).
- Adding rich contextual details: Elaborate on settings, character expressions, atmosphere.
- Clarifying artistic intent: Ensure mood, theme, and focus are clear.
- Improving overall clarity, evocative language, and structural flow for optimal interpretation by an AI image generator.
Present ONLY the final, rewritten, enhanced prompt as a single, coherent block of text. Do not include any explanations, preambles like "Here's the improved prompt:", or markdown formatting.`;
    case 'general':
    default:
      return `Critically analyze the following user-provided prompt. Rewrite this prompt to be significantly more effective for an AI assistant. Enhance it by increasing specificity (clearly stating the desired outcome, format, key requirements), adding necessary context (suggesting placeholders if missing), defining constraints (limitations, exclusions), optionally suggesting an expert persona for the AI, and improving overall clarity and structure for better readability and logical flow. Present only the final, rewritten, enhanced prompt as a single, coherent block of text. Do not include any explanations, preambles like "Here's the improved prompt:", or markdown formatting.`;
  }
};


export const enhanceExistingPrompt = async (existingPrompt: string, persona: PromptPersona): Promise<string> => {
  if (!isApiKeyConfigured() || !ai) { // Added !ai check for type safety
    throw new Error("Gemini API is not available. Please configure your API Key via the 'API Key' button in the footer.");
  }

  const systemInstruction = getSystemInstructionForEnhancement(persona);
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: existingPrompt, 
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, 
        topP: 0.9,
        topK: 50
      }
    });
    return response.text.trim();
  } catch (error: any) {
    console.error("Error enhancing prompt:", error);
     if (error.message && (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID")) ) {
         throw new Error("The API Key is invalid or has expired. Please check it and update via the 'API Key' button.");
    }
    if (error.message && error.message.toLowerCase().includes("quota")) {
        throw new Error("API usage limit reached. Please try again later.");
    }
    throw new Error(`Could not enhance prompt: ${error.message || String(error)}`);
  }
};
