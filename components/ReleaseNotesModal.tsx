import React from 'react';
import { CloseIcon } from '../constants';

interface ReleaseNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const releaseNotes = [
  {
    version: "v1.3.0",
    date: "Latest Update",
    notes: [
      "Implement Vercel Analytics",
      "Implement Google GenAI"
    ]
  },
  {
    version: "v1.2.2",
    date: "Previous Update",
    notes: [
      "Fixed: Promote new logo for application",
      "Fixed: Improve UI for prompt input card",
      "Refactor footer UI"
    ]
  },
  {
    version: "v1.2.0",
    date: "Previous Update",
    notes: [
      "CSS Focus Styles Disabled: All focus outlines and ring styles have been removed via global CSS and component-level class removal as per user request.",
      "Accessibility Note: This change may impact users who rely on keyboard navigation or have certain visual impairments, as visual focus indicators are no longer present."
    ]
  },
  {
    version: "v1.1.0",
    date: "Previous Update",
    notes: [
      "Application interface and all text fully translated to English.",
      "Added 'Prompt Persona' selection (General, Engineer - ReactJS, Artist - Visual Arts) for tailored prompt generation.",
      "'Enhance Prompt' functionality is now persona-aware, providing more targeted improvements based on the selected persona.",
      "Introduced this Release Notes modal.",
    ]
  },
  {
    version: "v1.0.0",
    date: "Initial Release",
    notes: [
      "Core features: Generate Prompts from idea, Enhance existing Prompt.",
      "History tracking for prompts and ideas.",
      "Initial UI and styling.",
    ]
  }
];

export const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-zodiacDeepBlue/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="release-notes-title"
    >
      <div 
        className="bg-surfaceElevated p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-borderSubtle/70 text-textOnDarkPrimary custom-scrollbar"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="release-notes-title" className="text-2xl font-semibold text-zodiacLavender">Release Notes</h2>
          <button 
            onClick={onClose} 
            className="text-textOnDarkMuted hover:text-zodiacLavender transition-colors p-1 rounded-full"
            aria-label="Close release notes"
          >
            {CloseIcon}
          </button>
        </div>
        
        <div className="space-y-6">
          {releaseNotes.map((release) => (
            <div key={release.version} className="border-b border-borderSubtle/40 pb-4 last:border-b-0">
              <h3 className="text-xl font-medium text-textOnDarkSecondary">{release.version} <span className="text-sm text-accentNiagara">({release.date})</span></h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-textOnDarkMuted text-sm md:text-base">
                {release.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button 
            onClick={onClose} 
            className="mt-8 w-full bg-gradient-to-r from-zodiacLavender to-accentNiagara hover:shadow-soft-glow-lavender text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-300"
        >
            Close
        </button>
      </div>
    </div>
  );
};