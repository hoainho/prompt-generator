import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '../constants'; 

interface EnhancedPromptDisplayProps {
  prompt: string;
}

export const EnhancedPromptDisplay: React.FC<EnhancedPromptDisplayProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Could not copy to clipboard.');
    }
  };

  if (!prompt) {
    return null;
  }

  return (
    <div className="bg-surfaceBase/80 p-6 rounded-xl shadow-inner border border-borderSubtle/60 backdrop-blur-lg relative">
      <h3 className="text-lg font-semibold text-textOnDarkPrimary mb-4">Enhanced Prompt:</h3>
      <button
        onClick={handleCopy}
        className="absolute top-5 right-5 p-2 text-textOnDarkMuted hover:text-accentNiagara rounded-md transition-colors"
        title="Copy prompt"
        aria-label={copied ? "Prompt copied" : "Copy prompt"}
      >
         {copied ? React.cloneElement(CheckIcon, { className: "w-5 h-5 text-accentNiagara" }) : ClipboardIcon}
      </button>
      <div className="p-4 bg-zodiacOxfordBlue/80 border border-borderStrong/70 rounded-lg shadow-sm">
        <p className="text-textOnDarkSecondary whitespace-pre-wrap text-sm md:text-base break-words">{prompt}</p>
      </div>
       {copied && <p className="text-xs text-accentNiagara mt-2 text-right pr-1">Copied!</p>}
    </div>
  );
};