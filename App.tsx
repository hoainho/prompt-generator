
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { TabButton } from './components/TabButton';
import { PromptInputCard } from './components/PromptInputCard';
import { GeneratedPromptsDisplay } from './components/GeneratedPromptsDisplay';
import { EnhancedPromptDisplay } from './components/EnhancedPromptDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { HistoryDisplay } from './components/HistoryDisplay';
import { ReleaseNotesModal } from './components/ReleaseNotesModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { 
  generatePromptsFromIdea, 
  enhanceExistingPrompt,
  setApiKey, 
  getCurrentApiKey, 
  isApiKeyConfigured 
} from './services/geminiService';
import { SparklesIcon, HistoryIcon, CogIcon, KeyIcon, WebsiteIcon, EmailIcon, LinkedInIcon } from './constants';
import type { TabOption, PromptHistoryItem, PromptPersona } from './types';

const MAX_HISTORY_ITEMS = 20;
const LOCAL_STORAGE_KEY = 'promptAppHistory_v2';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabOption>('generate');
  const [currentPersona, setCurrentPersona] = useState<PromptPersona>('general');
  
  const [generateIdea, setGenerateIdea] = useState<string>('');
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [isLoadingGenerate, setIsLoadingGenerate] = useState<boolean>(false);
  const [errorGenerate, setErrorGenerate] = useState<string | null>(null);

  const [promptToEnhance, setPromptToEnhance] = useState<string>('');
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [isLoadingEnhance, setIsLoadingEnhance] = useState<boolean>(false);
  const [errorEnhance, setErrorEnhance] = useState<string | null>(null);

  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>([]);
  const [isReleaseNotesOpen, setIsReleaseNotesOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [apiKeyIsSet, setApiKeyIsSet] = useState<boolean>(isApiKeyConfigured());

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHistory) {
        setPromptHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
    }
    setApiKeyIsSet(isApiKeyConfigured());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(promptHistory));
    } catch (error) {
      console.error("Failed to save history to localStorage:", error);
    }
  }, [promptHistory]);

  const handleSaveApiKey = useCallback((newKey: string) => {
    setApiKey(newKey);
    setApiKeyIsSet(isApiKeyConfigured());
  }, []);

  const addToHistory = useCallback((promptText: string, type: PromptHistoryItem['type'], relatedIdeaValue?: string) => {
    setPromptHistory(prevHistory => {
      const newItem: PromptHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        prompt: promptText,
        type,
        relatedIdea: type === 'generated' ? relatedIdeaValue : undefined,
        timestamp: Date.now(),
      };
      if (prevHistory.length > 0 && prevHistory[0].prompt === newItem.prompt && prevHistory[0].type === newItem.type) {
        return prevHistory;
      }
      const updatedHistory = [newItem, ...prevHistory];
      return updatedHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const handleClearHistory = useCallback(() => {
    setPromptHistory([]);
  }, []);

  const handleUseHistoryItem = useCallback((item: PromptHistoryItem) => {
    setErrorGenerate(null);
    setErrorEnhance(null);
    setGeneratedPrompts([]);
    setEnhancedPrompt('');

    if (item.type === 'idea') {
      setGenerateIdea(item.prompt);
      setPromptToEnhance('');
      setActiveTab('generate');
    } else if (item.type === 'generated') {
      setGenerateIdea(item.relatedIdea || ''); 
      setPromptToEnhance(item.prompt); 
      setActiveTab('enhance'); 
    } else if (item.type === 'enhancement_source' || item.type === 'enhanced') {
      setPromptToEnhance(item.prompt);
      setGenerateIdea('');
      setActiveTab('enhance');
    }
  }, []);


  const handleGeneratePrompts = useCallback(async () => {
    if (!apiKeyIsSet) {
      setErrorGenerate("API Key not configured. Please set your API Key using the 'Configure API Key' button.");
      return;
    }
    if (!generateIdea.trim()) {
      setErrorGenerate("Please enter an idea to generate prompts.");
      return;
    }
    setIsLoadingGenerate(true);
    setErrorGenerate(null);
    setGeneratedPrompts([]);
    try {
      const prompts = await generatePromptsFromIdea(generateIdea, currentPersona);
      setGeneratedPrompts(prompts);
      addToHistory(generateIdea, 'idea');
      prompts.forEach(p => addToHistory(p, 'generated', generateIdea));
    } catch (err) {
      setErrorGenerate(err instanceof Error ? err.message : "An unknown error occurred while generating prompts.");
      console.error("Generation error:", err);
    } finally {
      setIsLoadingGenerate(false);
    }
  }, [generateIdea, currentPersona, addToHistory, apiKeyIsSet]);

  const handleEnhancePrompt = useCallback(async () => {
    if (!apiKeyIsSet) {
      setErrorEnhance("API Key not configured. Please set your API Key using the 'Configure API Key' button.");
      return;
    }
    if (!promptToEnhance.trim()) {
      setErrorEnhance("Please enter a prompt to enhance.");
      return;
    }
    setIsLoadingEnhance(true);
    setErrorEnhance(null);
    setEnhancedPrompt('');
    try {
      addToHistory(promptToEnhance, 'enhancement_source');
      const result = await enhanceExistingPrompt(promptToEnhance, currentPersona);
      setEnhancedPrompt(result);
      addToHistory(result, 'enhanced');
    } catch (err) {
      setErrorEnhance(err instanceof Error ? err.message : "An unknown error occurred while enhancing the prompt.");
      console.error("Enhancement error:", err);
    } finally {
      setIsLoadingEnhance(false);
    }
  }, [promptToEnhance, currentPersona, addToHistory, apiKeyIsSet]);
  
  const renderActiveContent = () => {
    const commonPersonaSelect = (idSuffix: string) => (
       <div className="mb-6 bg-surfaceElevated/80 p-4 rounded-xl border border-borderSubtle shadow-deep-lift">
        <label htmlFor={`persona-select-${idSuffix}`} className="block text-sm font-medium text-textOnDarkSecondary mb-1.5">
          {activeTab === 'generate' ? 'Select Prompt Persona:' : 'Target Persona for Enhancement:'}
        </label>
        <select
          id={`persona-select-${idSuffix}`}
          value={currentPersona}
          onChange={(e) => setCurrentPersona(e.target.value as PromptPersona)}
          className="w-full p-3 border border-borderStrong rounded-lg bg-zodiacOxfordBlue text-textOnDarkPrimary placeholder-textOnDarkMuted shadow-sm transition-all"
          disabled={!apiKeyIsSet && (isLoadingGenerate || isLoadingEnhance)}
        >
          <option value="general">General / Creative</option>
          <option value="engineer_react">Engineer (ReactJS)</option>
          <option value="artist_visual">Artist (Visual Arts)</option>
        </select>
        {activeTab === 'enhance' && <p className="text-xs text-textOnDarkMuted mt-2">The enhancement will be tailored for this persona.</p>}
      </div>
    );

    if (!apiKeyIsSet && (activeTab === 'generate' || activeTab === 'enhance')) {
        return (
            <div className="text-center py-10 bg-surfaceBase/90 p-6 rounded-xl border border-zodiacLavender/50 shadow-deep-lift">
                <div className="text-zodiacLavender mb-4 w-12 h-12 mx-auto">{KeyIcon}</div>
                <h3 className="text-xl font-semibold text-textOnDarkPrimary mb-2">API Key Required</h3>
                <p className="text-textOnDarkSecondary mb-4">
                    To use the {activeTab === 'generate' ? 'prompt generation' : 'prompt enhancement'} features, please configure your Gemini API Key.
                </p>
                <button
                    onClick={() => setIsApiKeyModalOpen(true)}
                    className="bg-gradient-to-r from-zodiacLavender via-accentLavenderRose to-zodiacLavender hover:shadow-soft-glow-lavender text-zodiacDeepBlue font-bold py-2.5 px-5 rounded-lg transition-all duration-300"
                >
                    Configure API Key
                </button>
            </div>
        );
    }


    switch (activeTab) {
      case 'generate':
        return (
          <div className="space-y-6">
            {commonPersonaSelect('generate')}
            <PromptInputCard
              id="generate-idea"
              title="Enter your core idea"
              placeholder="e.g., A superhero character based on an insect, a short story about time travel,..."
              value={generateIdea}
              onChange={setGenerateIdea}
              onSubmit={handleGeneratePrompts}
              isLoading={isLoadingGenerate}
              buttonText="Generate Prompts"
              textAreaRows={3}
              disabled={!apiKeyIsSet || isLoadingGenerate}
            />
            {errorGenerate && <ErrorMessage message={errorGenerate} />}
            {isLoadingGenerate && (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            )}
            {!isLoadingGenerate && generatedPrompts.length > 0 && (
              <GeneratedPromptsDisplay prompts={generatedPrompts} />
            )}
          </div>
        );
      case 'enhance':
        return (
          <div className="space-y-6">
            {commonPersonaSelect('enhance')}
            <PromptInputCard
              id="enhance-prompt"
              title="Enter prompt you want to enhance"
              placeholder="e.g., Write about a cat..."
              value={promptToEnhance}
              onChange={setPromptToEnhance}
              onSubmit={handleEnhancePrompt}
              isLoading={isLoadingEnhance}
              buttonText="Enhance Prompt"
              textAreaRows={5}
              disabled={!apiKeyIsSet || isLoadingEnhance}
            />
            {errorEnhance && <ErrorMessage message={errorEnhance} />}
            {isLoadingEnhance && (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            )}
            {!isLoadingEnhance && enhancedPrompt && (
              <EnhancedPromptDisplay prompt={enhancedPrompt} />
            )}
          </div>
        );
      case 'history':
        return (
          <HistoryDisplay
            history={promptHistory}
            onUseItem={handleUseHistoryItem}
            onClearHistory={handleClearHistory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-textOnDarkPrimary flex flex-col items-center p-4 md:p-8 selection:bg-zodiacLavender selection:text-zodiacDeepBlue relative z-10">
      <div className="w-full max-w-3xl mx-auto">
        <Header title="Prompt Generator & Enhancer" />

        <div className="my-6 flex flex-col sm:flex-row justify-end items-center sm:space-x-4 space-y-2 sm:space-y-0 p-3 bg-surfaceElevated/70 backdrop-blur-md rounded-xl border border-borderSubtle/60 shadow-md">
          <p className={`text-xs ${apiKeyIsSet ? 'text-accentSlepticTeal' : 'text-yellow-400 animate-pulse'}`}>
            {apiKeyIsSet ? "Gemini API Key is configured." : "API Key not configured."}
          </p>
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-accentNiagara hover:bg-opacity-80 text-white font-semibold rounded-lg transition-all duration-200 text-sm shadow-sm hover:shadow-soft-glow-niagara"
            aria-label="Configure API Key"
          >
            <span className="mr-2 w-4 h-4">{KeyIcon}</span>
            Configure API Key
          </button>
        </div>

        <div className="my-8 bg-surfaceBase backdrop-blur-xl shadow-2xl rounded-2xl border border-borderSubtle/70 overflow-hidden">
          <div className="flex border-b border-borderStrong/50">
            <TabButton
              label="Generate Prompts"
              isActive={activeTab === 'generate'}
              onClick={() => setActiveTab('generate')}
              icon={SparklesIcon}
            />
            <TabButton
              label="Enhance Prompt"
              isActive={activeTab === 'enhance'}
              onClick={() => setActiveTab('enhance')}
              icon={CogIcon}
            />
             <TabButton
              label="History"
              isActive={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
              icon={HistoryIcon}
            />
          </div>

          <div className="p-6 md:p-8 min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
            {renderActiveContent()}
          </div>
        </div>
        
        <footer className="w-full text-center py-10 mt-16 relative">
          <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            
            <div className="text-textOnDarkSecondary text-sm text-center md:text-left">
              <p className="font-semibold text-textOnDarkPrimary text-base">Nguyễn Hoài Nhớ</p>
              <p className="text-xs">&copy; {new Date().getFullYear()} Senior Software Engineer. All rights reserved.</p>
              <button 
                onClick={() => setIsReleaseNotesOpen(true)} 
                className="mt-3 text-zodiacLavender hover:text-accentLavenderRose underline text-xs transition-colors rounded"
              >
                Release Notes
              </button>
            </div>

            <div className="flex flex-col items-center md:items-end space-y-3">
              <div className="flex space-x-6">
                <a 
                  href="https://www.hoainho.info" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-textOnDarkMuted hover:text-zodiacLavender transition-colors duration-300 transform hover:scale-110 rounded-full" 
                  title="Website"
                  aria-label="Visit Hoai Nho's Website"
                >
                  {WebsiteIcon}
                </a>
                <a 
                  href="mailto:hoainho.work@gmail.com" 
                  className="text-textOnDarkMuted hover:text-zodiacLavender transition-colors duration-300 transform hover:scale-110 rounded-full"
                  title="Email Hoai Nho"
                  aria-label="Send an email to Hoai Nho"
                >
                  {EmailIcon}
                </a>
                <a 
                  href="https://www.linkedin.com/in/hoai-nho/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-textOnDarkMuted hover:text-zodiacLavender transition-colors duration-300 transform hover:scale-110 rounded-full"
                  title="Hoai Nho's LinkedIn Profile"
                  aria-label="Visit Hoai Nho's LinkedIn Profile"
                >
                  {LinkedInIcon}
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <ReleaseNotesModal isOpen={isReleaseNotesOpen} onClose={() => setIsReleaseNotesOpen(false)} />
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
        currentKey={getCurrentApiKey()}
      />
    </div>
  );
};

export default App;