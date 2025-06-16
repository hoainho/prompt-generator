import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { SparklesIcon, CogIcon } from '../constants';

interface PromptInputCardProps {
  id: string;
  title: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  buttonText: string;
  textAreaRows?: number;
  disabled?: boolean;
}

export const PromptInputCard: React.FC<PromptInputCardProps> = ({
  id,
  title,
  placeholder,
  value,
  onChange,
  onSubmit,
  isLoading,
  buttonText,
  textAreaRows = 4,
  disabled = false
}) => {
  const iconForButton = buttonText.toLowerCase().includes("enhance") ? CogIcon : SparklesIcon;
  return (
    <div className="bg-surfaceElevated/80 p-6 rounded-xl shadow-deep-lift border border-borderSubtle backdrop-blur-lg">
      <label htmlFor={id} className="block text-xl font-semibold text-textOnDarkPrimary mb-4">
        {title}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3.5 border border-borderStrong rounded-lg transition-all duration-200 ease-in-out resize-y bg-zodiacOxfordBlue text-textOnDarkPrimary placeholder-textOnDarkMuted shadow-inner"
        rows={textAreaRows}
        disabled={isLoading || disabled}
        aria-label={title}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !value.trim() || disabled}
        className="mt-5 w-full flex items-center justify-center bg-gradient-to-r from-zodiacLavender via-accentLavenderRose to-zodiacLavender hover:from-accentLavenderRose hover:to-zodiacLavender text-zodiacDeepBlue font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-soft-glow-lavender"
      >
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            <span className="group-hover:scale-110 transition-transform duration-200">{iconForButton}</span>
            <span className="ml-2.5">{buttonText}</span>
          </>
        )}
      </button>
    </div>
  );
};