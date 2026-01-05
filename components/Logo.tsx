import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#14532d" />
      </linearGradient>
    </defs>
    {/* Gem Shape Background */}
    <path 
      d="M50 5 L90 30 L90 70 L50 95 L10 70 L10 30 Z" 
      fill="url(#gemGradient)" 
      stroke="#14532d" 
      strokeWidth="2"
    />
    {/* PSX Graph Line Overlay */}
    <path 
      d="M25 65 L40 55 L55 60 L75 35" 
      stroke="white" 
      strokeWidth="5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Graph Dot */}
    <circle cx="75" cy="35" r="4" fill="white" />
  </svg>
);