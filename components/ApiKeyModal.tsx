import React, { useState, useEffect } from 'react';
import { CloseIcon, KeyIcon } from '../constants';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentKey: string | null;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, currentKey }) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(currentKey || '');
      setSaveMessage(null); 
    }
  }, [isOpen, currentKey]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(apiKeyInput);
    setSaveMessage(apiKeyInput.trim() ? "API Key saved." : "API Key cleared.");
    setTimeout(() => {
        setSaveMessage(null);
        onClose(); 
    }, 1500);
  };

  const handleClearKey = () => {
    setApiKeyInput('');
  };


  return (
    <div 
      className="fixed inset-0 bg-zodiacDeepBlue/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
    >
      <div 
        className="bg-surfaceElevated p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg border border-borderSubtle/70 text-textOnDarkPrimary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="api-key-modal-title" className="text-2xl font-semibold text-zodiacLavender flex items-center">
            <span className="mr-2">{KeyIcon}</span> Configure API Key
          </h2>
          <button 
            onClick={onClose} 
            className="text-textOnDarkMuted hover:text-zodiacLavender transition-colors p-1 rounded-full"
            aria-label="Close API Key configuration"
          >
            {CloseIcon}
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-textOnDarkSecondary text-sm">
            Enter your Gemini API Key below. You can obtain a key from 
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zodiacLavender hover:text-accentLavenderRose underline ml-1 rounded"
            >
              Google AI Studio
            </a>.
          </p>
          <div>
            <label htmlFor="apiKeyInput" className="block text-sm font-medium text-textOnDarkSecondary mb-1.5">
              Gemini API Key:
            </label>
            <div className="flex items-center space-x-2">
                <input
                type="password"
                id="apiKeyInput"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full p-2.5 border border-borderStrong rounded-lg bg-zodiacOxfordBlue text-textOnDarkPrimary placeholder-textOnDarkMuted shadow-sm transition-all"
                placeholder="Enter your API Key"
                aria-describedby="api-key-status"
                />
                 {apiKeyInput && (
                    <button
                        onClick={handleClearKey}
                        className="p-2.5 text-xs bg-zodiacDeepBlue hover:bg-opacity-80 text-textOnDarkPrimary rounded-lg transition-colors"
                        title="Clear API Key input"
                    >
                        Clear
                    </button>
                 )}
            </div>
            {currentKey && !apiKeyInput && (
                 <p className="text-xs text-textOnDarkMuted mt-1.5">Current key is set. Enter a new key to change it, or clear and save to remove.</p>
            )}
             {!currentKey && !apiKeyInput && (
                 <p className="text-xs text-textOnDarkMuted mt-1.5">No API key is currently set.</p>
            )}
          </div>

          {saveMessage && (
            <p id="api-key-status" className="text-sm text-accentNiagara" role="status">{saveMessage}</p>
          )}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button 
                onClick={onClose} 
                className="px-4 py-2 bg-zodiacOxfordBlue hover:bg-opacity-80 text-textOnDarkPrimary font-medium rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleSave} 
                className="px-4 py-2 bg-gradient-to-r from-zodiacLavender via-accentLavenderRose to-zodiacLavender hover:shadow-soft-glow-lavender text-zodiacDeepBlue font-bold rounded-lg transition-all duration-300"
            >
                Save Key
            </button>
        </div>
      </div>
    </div>
  );
};