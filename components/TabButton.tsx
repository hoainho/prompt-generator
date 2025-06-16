import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, icon }) => {
  const activeClasses = 'border-zodiacLavender text-zodiacLavender font-semibold bg-surfaceElevated shadow-soft-glow-lavender';
  const inactiveClasses = 'border-transparent text-textOnDarkSecondary hover:text-textOnDarkPrimary hover:border-accentNiagara/50 hover:bg-surfaceElevated/70';
  
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center px-3 py-4 md:px-4 md:py-4 text-sm md:text-base border-b-2 transition-all duration-300 ease-in-out 
                  ${isActive ? activeClasses : inactiveClasses}`}
      aria-pressed={isActive}
      role="tab"
      aria-selected={isActive}
    >
      {icon && <span className="mr-2 w-5 h-5">{icon}</span>}
      {label}
    </button>
  );
};