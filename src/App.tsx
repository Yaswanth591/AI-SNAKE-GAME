import React from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="flex flex-col min-h-[100vh] h-full lg:h-[100vh] lg:overflow-hidden p-6 max-w-[1024px] mx-auto w-full font-sans uppercase tracking-[2px]">
      <header className="flex justify-between items-center mb-6 pb-3 border-b border-border-color shrink-0">
          <div className="text-xl md:text-2xl font-neon tracking-[-1px] text-neon-cyan drop-shadow-[2px_2px_0px_#ff00ff] whitespace-nowrap glitch" data-text="PR0T0C0L_0XF">
              PR0T0C0L_0XF
          </div>
          <div className="text-neon-magenta text-lg hidden md:block tracking-widest whitespace-nowrap ml-4 animate-pulse">
              NODE: DEGRADED | PACKET_LOSS: 94%
          </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] lg:grid-rows-[1fr_1fr] gap-5 flex-1 min-h-0 w-full">
         <SnakeGame />
         <MusicPlayer />
      </div>
    </div>
  );
}
