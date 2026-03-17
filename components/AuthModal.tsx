'use client';

import { X, Lock, Rocket, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  title = "Join the Tribe", 
  description = "You need a ZOKU account to RSVP for events and connect with others." 
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zoku-bg/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-zoku-card border border-zoku-border rounded-[2.5rem] shadow-2xl p-8 md:p-10 animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
        {/* Decorative elements */}
        <div className="orb w-48 h-48 bg-purple-DEFAULT -top-24 -right-24 opacity-10" />
        <div className="orb w-32 h-32 bg-cyan -bottom-16 -left-16 opacity-10" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-muted hover:text-zoku-text hover:bg-zoku-bg transition-all"
        >
          <X size={20} />
        </button>

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-purple-DEFAULT to-pink flex items-center justify-center text-white mx-auto mb-8 shadow-neon-purple scale-110">
            <Lock size={32} />
          </div>
          
          <h2 className="text-3xl font-black text-zoku-text mb-4 tracking-tight">{title}</h2>
          <p className="text-muted text-base mb-10 leading-relaxed font-medium">
            {description}
          </p>

          <div className="space-y-4">
            <Link 
              href="/signup" 
              className="w-full btn-primary !py-4 !rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-neon-purple active:scale-95 transition-all"
            >
              <Rocket size={20} /> Create Free Account
            </Link>
            <Link 
              href="/login" 
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-zoku-bg border border-zoku-border text-zoku-text font-black text-xs hover:bg-zoku-card transition-all active:scale-95 uppercase tracking-widest"
            >
              Log into ZOKU
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-black text-muted uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-green" /> Secure Auth</span>
            <span className="w-1 h-1 rounded-full bg-zoku-border" />
            <span className="flex items-center gap-1.5">No Spam</span>
          </div>
        </div>
      </div>
    </div>
  );
}
