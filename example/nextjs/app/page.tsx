import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#040404] text-white font-sans overflow-x-hidden flex flex-col items-center justify-center p-8">
      {/* Background Ambient Glows */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#b6f09c]/10 via-transparent to-blue-500/10 blur-[120px] -z-10 rounded-full pointer-events-none"></div>

      {/* Main Hero Container */}
      <main className="flex flex-col items-center text-center max-w-4xl relative">

        {/* Scaled Logos */}
        <div className="flex items-center gap-10 mb-12 group">
          {/* cloudCSS Logo */}
          <div className="relative cursor-pointer">
            <div className="absolute -inset-8 bg-[#b6f09c]/30 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-1000 relative z-10 select-none overflow-hidden">
              <img src="/cloudcss.svg" alt="cloudCSS Logo" className="w-24 h-24 object-contain" />
            </div>
          </div>

          <div className="h-24 w-px bg-white/10 group-hover:h-32 transition-all duration-1000 rotate-[30deg]"></div>

          {/* Vercel Logo */}
          <div className="relative cursor-pointer">
            <div className="absolute -inset-8 bg-white/20 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="w-32 h-32 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 relative z-10">
              <img src="/vercel.svg" alt="Vercel Logo" className="w-24 h-24 object-contain" />

            </div>
          </div>

        </div>

        {/* Scaled Brand Typography */}
        <h1 className="text-8xl font-black italic tracking-tighter uppercase leading-[0.8] mb-8 select-none">
        cloud<span className="text-[#b6f09c] drop-shadow-[0_0_60px_rgba(182,240,156,0.6)] hover:text-white transition-colors duration-500">CSS</span>
        </h1>

        <p className="text-2xl text-[#a1a1aa] font-bold tracking-tight max-w-2xl leading-tight opacity-80 mb-12">
          The high-performance UI engine for <span className="text-white border-b-4 border-[#b6f09c]">Next.js</span>.
          Utility-first styling perfected by <span className="text-white">cloudCSS</span>.
        </p>

        {/* Scaled Starter Actions */}
        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/docs" className="px-12 py-4 bg-[#b6f09c] text-black font-black uppercase tracking-tighter text-xl rounded-2xl hover:bg-white hover:scale-105 transition-all shadow-[0_20px_40px_rgba(182,240,156,0.2)] active:scale-95 cursor-pointer">
            Documentation
          </Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="px-12 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-tighter text-xl rounded-2xl hover:bg-white/10 transition-all active:scale-95 cursor-pointer flex items-center gap-4">
            GitHub
          </a>
        </div>

        {/* Tagline */}
        <div className="mt-24 text-[#444] text-[10px] font-black uppercase tracking-[0.5em] select-none">
          Zero-Runtime • Infinite Style • cloudCSS
        </div>
      </main>
    </div>
  );
}
