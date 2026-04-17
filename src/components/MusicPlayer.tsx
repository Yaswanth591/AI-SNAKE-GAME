import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, VolumeX } from 'lucide-react';

export const TRACKS = [
  {
    id: 1,
    title: "Synthwave Alpha",
    artist: "AI Gen 01",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    cover: "https://picsum.photos/seed/synthwave/200/200"
  },
  {
    id: 2,
    title: "Cybernetic Pulse",
    artist: "AI Gen 02",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    cover: "https://picsum.photos/seed/cybernetic/200/200"
  },
  {
    id: 3,
    title: "Neon Horizon",
    artist: "AI Gen 03",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    cover: "https://picsum.photos/seed/neon/200/200"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [, setForceRender] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };
  
  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
  };
  
  const handleEnded = () => {
    nextTrack();
  };

  const formatTime = (time: number | null | undefined) => {
    if (time == null || isNaN(time) || !isFinite(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="bg-card-bg border border-border-color p-5 lg:row-span-1 flex flex-col gap-3 relative overflow-hidden shadow-[-4px_-4px_0_var(--color-neon-cyan)]">
         <span className="text-[14px] uppercase tracking-[1px] text-neon-cyan font-bold mb-1 font-neon">DATA_STREAMS</span>
         <div className="flex flex-col gap-1 overflow-y-auto pr-1 flex-1">
           {TRACKS.map((track, idx) => {
             const active = idx === currentTrackIndex;
             return (
               <div 
                 key={track.id}
                 onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
                 className={`flex items-center gap-3 p-2.5 cursor-pointer transition-colors border-l-[4px] ${active ? 'bg-[rgba(255,0,255,0.2)] border-neon-magenta text-white' : 'border-transparent hover:bg-border-color text-text-main'}`}
               >
                 <div 
                   className="w-10 h-10 shrink-0 bg-cover bg-center grayscale contrast-150 mix-blend-screen"
                   style={{ 
                     backgroundImage: `url(${track.cover})`,
                     boxShadow: active ? 'inset 0 0 0 2px var(--color-neon-magenta)' : 'none'
                   }}
                 ></div>
                 <div className="flex-1 min-w-0">
                    <div className="text-[16px] font-bold truncate leading-tight mb-0.5">{track.title.toUpperCase()}</div>
                    <div className="text-[14px] text-neon-cyan truncate">{track.artist.toUpperCase()}</div>
                 </div>
               </div>
             )
           })}
         </div>
      </div>

      <div className="bg-card-bg border border-border-color p-5 lg:row-span-1 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-[4px_-4px_0_var(--color-neon-magenta)]">
          <span className="text-[14px] uppercase tracking-[1px] text-neon-magenta font-bold absolute top-5 left-5 font-neon">DECRYPTING_SIGNAL</span>
          
          <div className="text-xl font-bold mt-2 text-text-main truncate max-w-full px-2 w-full drop-shadow-[2px_2px_0_var(--color-neon-magenta)]">{currentTrack.title.toUpperCase()}</div>
          
          {/* Visualizer bars */}
          <div className="flex items-end justify-center w-full gap-[2px] h-[30px] mt-2 mb-2 px-1">
            {[40, 80, 60, 90, 30, 70, 50, 85].map((h, i) => (
               <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-neon-cyan' : 'bg-neon-magenta'} opacity-80 transition-all duration-75`} style={{ height: isPlaying ? `${h}%` : '10%' }}></div>
            ))}
          </div>

          <div className="flex items-center gap-5 mt-3">
            <button onClick={prevTrack} className="w-[48px] h-[48px] border-2 border-neon-cyan flex items-center justify-center text-neon-cyan bg-black cursor-pointer hover:bg-neon-cyan hover:text-black transition-colors rounded-none">
              <span className="text-sm tracking-[-2px]">&#9664;&#9664;</span>
            </button>
            <button onClick={togglePlay} className="w-[56px] h-[56px] bg-neon-magenta text-black border-2 border-white flex items-center justify-center shadow-[4px_4px_0_var(--color-neon-cyan)] cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--color-neon-cyan)] transition-all rounded-none">
              <span className="text-lg font-bold pb-[1px]">{isPlaying ? '❚❚' : '▶'}</span>
            </button>
            <button onClick={nextTrack} className="w-[48px] h-[48px] border-2 border-neon-cyan flex items-center justify-center text-neon-cyan bg-black cursor-pointer hover:bg-neon-cyan hover:text-black transition-colors rounded-none">
              <span className="text-sm tracking-[-2px]">&#9654;&#9654;</span>
            </button>
           </div>
          
          <div className="w-full h-[6px] bg-border-color mt-5 relative border border-[#222]">
              <div className="h-full bg-white shadow-[0_0_10px_var(--color-neon-cyan)] transition-all ease-linear" style={{ width: audioRef.current?.duration ? `${(audioRef.current.currentTime / audioRef.current.duration) * 100}%` : '0%' }}></div>
          </div>
          
          <div className="flex justify-between w-full mt-2 text-[12px] text-text-dim font-bold">
              <span>{formatTime(audioRef.current?.currentTime)}</span>
              <span>{formatTime(audioRef.current?.duration)}</span>
          </div>

          <audio
            ref={audioRef}
            src={currentTrack.url}
            onEnded={handleEnded}
            onTimeUpdate={() => setForceRender(Date.now())}
          />
      </div>
    </>
  );
}
