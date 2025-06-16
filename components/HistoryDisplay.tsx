import React from 'react';
import type { PromptHistoryItem } from '../types';
import { TrashIcon, ReuseIcon } from '../constants';

interface HistoryDisplayProps {
  history: PromptHistoryItem[];
  onUseItem: (item: PromptHistoryItem) => void;
  onClearHistory: () => void;
}

const getActionTextAndColor = (type: PromptHistoryItem['type']): {text: string, color: string} => {
  switch (type) {
    case 'idea': return { text: 'Used Idea', color: 'text-accentNiagara' }; 
    case 'generated': return { text: 'Generated Prompt', color: 'text-accentSlepticTeal' }; 
    case 'enhancement_source': return { text: 'Original Prompt', color: 'text-zodiacSubmarineLight' };
    case 'enhanced': return { text: 'Enhanced Prompt', color: 'text-zodiacLavender' }; 
    default: return { text: 'History Item', color: 'text-textOnDarkMuted'};
  }
}

export const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, onUseItem, onClearHistory }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-textOnDarkSecondary text-lg">Your prompt history is empty.</p>
        <p className="text-textOnDarkMuted text-sm mt-2">Prompts you generate or enhance will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-borderSubtle/50">
        <h3 className="text-xl font-semibold text-textOnDarkPrimary">Prompt History</h3>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center"
            title="Clear all history"
          >
            {React.cloneElement(TrashIcon, {className: "w-4 h-4"})}
            <span className="ml-1.5">Clear All</span>
          </button>
        )}
      </div>
      <ul className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        {history.map((item) => {
          const { text: itemTypeText, color: itemTypeColor } = getActionTextAndColor(item.type);
          return (
            <li 
              key={item.id} 
              className="p-4 bg-surfaceElevated/80 border border-borderSubtle/70 rounded-xl shadow-lg hover:shadow-deep-lift hover:border-focusRingAccent/50 transition-all duration-200 flex flex-col"
            >
              <div className="flex justify-between items-start mb-2.5">
                <div>
                  <p className={`text-xs ${itemTypeColor} font-semibold uppercase tracking-wider`}>{itemTypeText}</p>
                  <p className="text-xs text-textOnDarkMuted mt-0.5">
                    {new Date(item.timestamp).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
                <button
                  onClick={() => onUseItem(item)}
                  className="p-1.5 text-zodiacLavender hover:text-accentLavenderRose rounded-md transition-colors text-xs font-medium flex items-center hover:bg-zodiacOxfordBlue/70"
                  title="Reuse this prompt"
                >
                  {React.cloneElement(ReuseIcon, {className: "w-4 h-4"})} <span className="ml-1">Use</span>
                </button>
              </div>
              <p className="text-textOnDarkSecondary text-sm break-words whitespace-pre-wrap flex-grow my-1">
                {item.prompt}
              </p>
              {item.type === 'generated' && item.relatedIdea && (
                   <p className="text-xs text-textOnDarkMuted mt-2 pt-2 border-t border-borderSubtle/40">
                      <span className="font-semibold text-textOnDarkSecondary">From idea:</span> {item.relatedIdea}
                  </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};