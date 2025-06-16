import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '../constants'; 

interface GeneratedPromptsDisplayProps {
  prompts: string[];
}

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Could not copy to clipboard.');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1.5 text-textOnDarkMuted hover:text-accentNiagara rounded-md transition-colors"
      title="Copy prompt"
      aria-label={copied ? "Prompt copied" : "Copy prompt"}
    >
      {copied ? React.cloneElement(CheckIcon, { className: "w-5 h-5 text-accentNiagara" }) : ClipboardIcon}
    </button>
  );
};


export const GeneratedPromptsDisplay: React.FC<GeneratedPromptsDisplayProps> = ({ prompts }) => {
  if (!prompts || prompts.length === 0) {
    return null;
  }

  return (
    <div className="bg-surfaceBase/80 p-6 rounded-xl shadow-inner border border-borderSubtle/60 backdrop-blur-lg">
      <h3 className="text-lg font-semibold text-textOnDarkPrimary mb-4">Generated Prompts:</h3>
      <ul className="space-y-3.5">
        {prompts.map((prompt, index) => (
          <li key={index} className="p-3.5 bg-zodiacOxfordBlue/80 border border-borderStrong/70 rounded-lg shadow-sm flex justify-between items-center text-textOnDarkSecondary hover:bg-zodiacOxfordBlue/90 transition-colors duration-150">
            <p className="flex-grow mr-2 text-sm md:text-base whitespace-pre-wrap break-words">{prompt}</p>
            <CopyButton textToCopy={prompt} />
          </li>
        ))}
      </ul>
    </div>
  );
};