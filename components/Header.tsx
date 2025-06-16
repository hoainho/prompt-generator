import React from 'react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="w-full py-6 text-center mb-6 md:mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zodiacLavender via-accentLavenderRose to-accentNiagara">
        {title}
      </h1>
      <p className="text-textOnDarkSecondary mt-4 text-lg md:text-xl">
        A powerful AI tool to optimize your prompts.
      </p>
    </header>
  );
};