'use client';

import { RotateCcw, SearchX } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  onClear: () => void;
  icon?: string;
}

export default function EmptyState({ title, description, onClear, icon = "🔎" }: EmptyStateProps) {
  return (
    <div className="text-center py-24 flex flex-col items-center glass border-dashed rounded-[3rem] animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-zoku-card rounded-[2rem] flex items-center justify-center text-5xl mb-8 shadow-inner animate-bounce-slow">
        {icon}
      </div>
      <h3 className="text-3xl font-black text-zoku-text mb-3 tracking-tight">{title}</h3>
      <p className="text-muted max-w-sm mb-10 text-lg leading-relaxed">{description}</p>
      <button 
        onClick={onClear} 
        className="btn-primary !py-4 !px-8 !rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest shadow-neon-purple active:scale-95 transition-all"
      >
        <RotateCcw size={20} /> Reset all filters
      </button>
    </div>
  );
}
