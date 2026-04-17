import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]; // Start a bit longer
const INITIAL_DIRECTION = { x: 0, y: -1 };

export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const directionRef = useRef(direction);
  // Store the actual direction the snake processed this frame to prevent double-turn self-collision
  const lastProcessedDirectionRef = useRef(direction); 
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    lastProcessedDirectionRef.current = INITIAL_DIRECTION;
    setFood(spawnFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    // Use a small timeout to allow UI update before focusing
    setTimeout(() => {
      containerRef.current?.focus();
    }, 10);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        
        // Use the intended direction, and update the processed direction
        const currentDir = directionRef.current;
        lastProcessedDirectionRef.current = currentDir;
        
        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y,
        };

        // Check walls - die on collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Check self-collision
        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(70, 150 - Math.floor(score / 50) * 10); // get faster over time
    const gameInterval = setInterval(moveSnake, speed);
    
    return () => clearInterval(gameInterval);
  }, [isPlaying, gameOver, food, spawnFood, highScore, score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      if (!isPlaying || gameOver) return;

      const { x, y } = lastProcessedDirectionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  return (
    <>
      <div className="flex flex-col gap-5 lg:row-span-2">
         <div className="bg-card-bg border border-border-color p-5 flex flex-col relative min-h-[140px] md:flex-1 justify-center shadow-[4px_4px_0_var(--color-neon-magenta)]">
             <span className="text-[14px] uppercase tracking-[2px] text-neon-magenta absolute top-5 left-5 font-bold animate-[pulse_2s_infinite] font-neon">DATA_MINED</span>
             <div className="text-5xl font-mono text-neon-cyan mt-4 drop-shadow-[2px_2px_0_var(--color-neon-magenta)]">{score.toString().padStart(4, '0')}</div>
         </div>
         <div className="bg-card-bg border border-border-color p-5 flex flex-col relative min-h-[140px] md:flex-1 justify-center shadow-[-4px_4px_0_var(--color-neon-cyan)]">
             <span className="text-[14px] uppercase tracking-[2px] text-neon-cyan absolute top-5 left-5 font-bold font-neon">MAX_ALLOC</span>
             <div className="text-5xl font-mono text-neon-magenta opacity-90 mt-4 drop-shadow-[-2px_2px_0_var(--color-neon-cyan)]">{highScore.toString().padStart(4, '0')}</div>
             <div className="mt-2.5 text-[14px] text-text-dim bg-black p-1 w-fit border border-border-color">MEM_CYCLE: ERR</div>
         </div>
         {/* On-screen controls for mobile */}
         <div className="grid grid-cols-3 gap-3 md:hidden w-full max-w-[240px] mx-auto mt-2">
            <div />
            <button onClick={() => { if(lastProcessedDirectionRef.current.y !== 1) directionRef.current = {x:0, y:-1}; containerRef.current?.focus(); }} className="bg-card-bg p-4 rounded-lg active:bg-border-color border border-border-color flex items-center justify-center select-none shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              <svg className="w-6 h-6 text-text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            </button>
            <div />
            <button onClick={() => { if(lastProcessedDirectionRef.current.x !== 1) directionRef.current = {x:-1, y:0}; containerRef.current?.focus(); }} className="bg-card-bg p-4 rounded-lg active:bg-border-color border border-border-color flex items-center justify-center select-none shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              <svg className="w-6 h-6 text-text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => { if(lastProcessedDirectionRef.current.y !== -1) directionRef.current = {x:0, y:1}; containerRef.current?.focus(); }} className="bg-card-bg p-4 rounded-lg active:bg-border-color border border-border-color flex items-center justify-center select-none shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              <svg className="w-6 h-6 text-text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button onClick={() => { if(lastProcessedDirectionRef.current.x !== -1) directionRef.current = {x:1, y:0}; containerRef.current?.focus(); }} className="bg-card-bg p-4 rounded-lg active:bg-border-color border border-border-color flex items-center justify-center select-none shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              <svg className="w-6 h-6 text-text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7-7" /></svg>
            </button>
         </div>
      </div>

      <div 
        className="lg:row-span-2 bg-[#000] border-2 border-neon-cyan shadow-[inset_0_0_20px_rgba(0,242,255,0.1)] p-[10px] flex flex-col relative aspect-square mx-auto w-full max-w-[600px] lg:max-w-none focus:outline-none"
        tabIndex={0}
        ref={containerRef}
      >
        <div 
          className="w-full h-full grid gap-[2px] bg-[#000]"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((seg, idx) => idx !== 0 && seg.x === x && seg.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div key={i} className={`w-full h-full ${
                isSnakeHead ? 'bg-neon-cyan border-[1px] border-neon-magenta z-10' :
                isSnakeBody ? 'bg-neon-magenta opacity-80 z-10' :
                isFood ? 'bg-white shadow-[0_0_10px_#fff] z-10 animate-ping' :
                'bg-[rgba(20,20,20,0.5)] border-[0.5px] border-[#333]'
              }`}>
              </div>
            );
          })}
        </div>
        
        {/* Mobile controls inside game area focus handler */}
        <div className="absolute inset-0 z-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); containerRef.current?.focus(); }}></div>
        
        {!isPlaying && !gameOver && (
           <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 pointer-events-none">
             <button 
               onClick={(e) => { e.stopPropagation(); resetGame(); }}
               className="font-neon text-xs md:text-[10px] lg:text-xs text-black bg-neon-cyan px-6 py-4 border-2 border-neon-magenta uppercase tracking-widest hover:bg-neon-magenta hover:border-neon-cyan hover:text-white transition-all active:scale-95 pointer-events-auto"
             >
               EXECUTE_OVERRIDE
             </button>
           </div>
        )}
        
        {gameOver && (
           <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 gap-6 pointer-events-none border-[4px] border-neon-magenta animate-[pulse_0.5s_infinite]">
             <div className="text-center">
               <h2 className="font-neon text-2xl md:text-3xl lg:text-2xl mb-2 text-neon-magenta drop-shadow-[2px_2px_0px_var(--color-neon-cyan)] tracking-wider">SEGFAULT</h2>
               <p className="text-neon-cyan font-mono mt-2 uppercase text-sm font-bold">MEM_CRPT: 0x{score.toString(16).padStart(4, '0').toUpperCase()}</p>
             </div>
             <button 
               onClick={(e) => { e.stopPropagation(); resetGame(); }}
               className="font-neon text-xs md:text-[10px] lg:text-xs text-black bg-neon-cyan px-6 py-4 border-2 border-neon-magenta uppercase hover:bg-neon-magenta hover:border-neon-cyan hover:text-white transition-all active:scale-95 pointer-events-auto"
             >
               RST_$B
             </button>
           </div>
        )}
      </div>
    </>
  );
}
