import React from 'react';

export const Marquee: React.FC = () => {
  const text = "✦ RESUMEPOP AI ✦ TURN RESUMES INTO STRUCTURED TALENT DATA ✦ REAL-TIME NLP & SPACY EXTRACTION ✦ SQLITE PERSISTENCE ✦ ONE STOP NOTES DESIGN ✦ EXPORT READY CSV ✦";
  return (
    <div className="bg-pop-pink text-pop-surface border-y-[2.5px] border-pop-border py-2 overflow-hidden select-none">
      <div className="animate-marquee whitespace-nowrap font-mono font-bold text-xs md:text-sm tracking-widest flex items-center gap-6">
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
};
