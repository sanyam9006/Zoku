'use client';

export default function ScrollButton() {
  return (
    <button
      onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float hover:text-purple-DEFAULT transition-colors"
    >
      <p className="text-xs text-muted font-medium tracking-widest uppercase">Scroll to explore</p>
      <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
        <div className="w-1 h-2 rounded-full bg-purple-DEFAULT animate-bounce" />
      </div>
    </button>
  );
}
