import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SETTINGS, INITIAL_SNAKE, INITIAL_DIRECTION, KEY_MAPPING, TRANSLATIONS, SKINS, THEMES } from './constants';
import { Coordinate, Direction, GameStatus, Language, AppView, GameRecord, SkinConfig, ThemeConfig } from './types';
import { GridBoard } from './components/GridBoard';
import { GameOverlay } from './components/GameOverlay';
import { Dashboard } from './components/Dashboard';
import { useInterval } from './hooks/useInterval';

// Icons
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
  </svg>
);

const LightningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const App: React.FC = () => {
  // --- Persistent Settings State ---
  const [language, setLanguage] = useState<Language>(() => 
    (localStorage.getItem('ns_lang') as Language) || 'zh'
  );
  const [currentSkin, setCurrentSkin] = useState<SkinConfig>(() => {
    const saved = localStorage.getItem('ns_skin');
    return saved ? SKINS[saved] || SKINS.CYBER : SKINS.CYBER;
  });
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('ns_theme');
    return saved ? THEMES[saved] || THEMES.DEFAULT : THEMES.DEFAULT;
  });
  const [highScore, setHighScore] = useState(0);
  const [history, setHistory] = useState<GameRecord[]>([]);

  // --- Game State ---
  const [view, setView] = useState<AppView>('GAME');
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(SETTINGS.initialSpeed);
  const [isDashing, setIsDashing] = useState(false);
  const [shake, setShake] = useState(false);

  // Refs
  const directionRef = useRef(INITIAL_DIRECTION);

  // --- Persistence Effects ---
  useEffect(() => { localStorage.setItem('ns_lang', language); }, [language]);
  useEffect(() => { localStorage.setItem('ns_skin', currentSkin.id); }, [currentSkin]);
  useEffect(() => { localStorage.setItem('ns_theme', currentTheme.id); }, [currentTheme]);
  
  // Load History & Highscore on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('ns_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
        if (parsed.length > 0) {
           const max = Math.max(...parsed.map((r: GameRecord) => r.score));
           setHighScore(max);
        }
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const saveRecord = useCallback((finalScore: number) => {
    const newRecord: GameRecord = {
      id: Date.now().toString(),
      score: finalScore,
      date: Date.now()
    };
    const newHistory = [newRecord, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    setHighScore(prev => Math.max(prev, finalScore));
    localStorage.setItem('ns_history', JSON.stringify(newHistory));
  }, [history]);

  const clearData = () => {
    localStorage.removeItem('ns_history');
    localStorage.removeItem('ns_skin');
    localStorage.removeItem('ns_theme');
    setHistory([]);
    setHighScore(0);
    setCurrentSkin(SKINS.CYBER);
    setCurrentTheme(THEMES.DEFAULT);
  };

  // --- Game Logic ---

  const generateFood = useCallback((currentSnake: Coordinate[]): Coordinate => {
    let newFood: Coordinate;
    let isCollision;
    do {
      newFood = {
        x: Math.floor(Math.random() * SETTINGS.gridSize),
        y: Math.floor(Math.random() * SETTINGS.gridSize),
      };
      // eslint-disable-next-line no-loop-func
      isCollision = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    } while (isCollision);
    return newFood;
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setSpeed(SETTINGS.initialSpeed);
    setStatus(GameStatus.PLAYING);
    setFood(generateFood(INITIAL_SNAKE));
    setIsDashing(false);
    setView('GAME');
  };

  const resumeGame = () => {
    setStatus(GameStatus.PLAYING);
  };

  const endGame = useCallback(() => {
    setStatus(GameStatus.GAME_OVER);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    if (score > 0) saveRecord(score);
  }, [score, saveRecord]);

  const gameLoop = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const currentDir = nextDirection;
      directionRef.current = currentDir;
      setDirection(currentDir);

      const newHead = { ...head };

      switch (currentDir) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Check Walls
      if (
        newHead.x < 0 || 
        newHead.x >= SETTINGS.gridSize || 
        newHead.y < 0 || 
        newHead.y >= SETTINGS.gridSize
      ) {
        endGame();
        return prevSnake;
      }

      // Check Self Collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check Food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(s => Math.max(50, s - SETTINGS.speedIncrement));
      } else {
        newSnake.pop(); 
      }

      return newSnake;
    });
  }, [food, generateFood, nextDirection, endGame]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Input only works in GAME view
      if (view !== 'GAME') return;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === " " && status === GameStatus.PLAYING) {
         setIsDashing(true);
         return;
      }

      if (e.key === "Escape" || e.key.toLowerCase() === "p") {
        setStatus(prev => prev === GameStatus.PLAYING ? GameStatus.PAUSED : (prev === GameStatus.PAUSED ? GameStatus.PLAYING : prev));
        return;
      }

      const desiredDir = KEY_MAPPING[e.key];
      if (!desiredDir) return;

      const currentDir = directionRef.current;
      const isOpposite = 
        (desiredDir === Direction.UP && currentDir === Direction.DOWN) ||
        (desiredDir === Direction.DOWN && currentDir === Direction.UP) ||
        (desiredDir === Direction.LEFT && currentDir === Direction.RIGHT) ||
        (desiredDir === Direction.RIGHT && currentDir === Direction.LEFT);

      if (!isOpposite) {
        setNextDirection(desiredDir);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === " ") setIsDashing(false);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, [status, view]);

  // Loop Tick
  const currentSpeed = isDashing ? speed / 2 : speed;
  // Only tick if playing AND in game view
  const tickDelay = (status === GameStatus.PLAYING && view === 'GAME') ? currentSpeed : null;
  useInterval(gameLoop, tickDelay);

  // Translations
  const t = TRANSLATIONS[language];

  return (
    <div className={`min-h-screen text-white flex flex-col items-center justify-center p-4 select-none overflow-hidden ${shake ? 'animate-shake' : ''} ${currentTheme.bgClass} transition-colors duration-500`}>
      
      {/* HUD */}
      <div className="w-full max-w-[500px] flex justify-between items-end mb-6 relative z-10">
        <div>
           <div className="flex items-center space-x-2 text-purple-400 mb-1">
             <TrophyIcon />
             <span className="text-xs font-bold tracking-widest uppercase">High Score</span>
           </div>
           <div className="text-2xl font-mono text-white/80">{highScore}</div>
        </div>

        <div className="text-right">
            <div className="flex items-center justify-end space-x-2 text-cyan-400 mb-1">
                <span className="text-xs font-bold tracking-widest uppercase">{t.dashboard.history.score}</span>
            </div>
            <div className="text-4xl font-mono font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]">
                {score.toString().padStart(4, '0')}
            </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative w-full max-w-[500px] aspect-square rounded-xl shadow-2xl overflow-hidden">
        {view === 'GAME' ? (
          <>
            <GameOverlay 
              status={status} 
              score={score} 
              highScore={highScore}
              onStart={startGame}
              onResume={resumeGame}
              onGoToDashboard={() => {
                setStatus(GameStatus.IDLE);
                setView('DASHBOARD');
              }}
              language={language}
            />
            <GridBoard 
              gridSize={SETTINGS.gridSize} 
              snake={snake} 
              food={food} 
              isGameOver={status === GameStatus.GAME_OVER}
              skin={currentSkin}
              theme={currentTheme}
            />
          </>
        ) : (
          <Dashboard 
            onBack={() => setView('GAME')}
            language={language}
            setLanguage={setLanguage}
            currentSkin={currentSkin}
            setSkin={setCurrentSkin}
            currentTheme={currentTheme}
            setTheme={setCurrentTheme}
            history={history}
            onClearData={clearData}
          />
        )}
      </div>

      {/* Footer / Controls Hint */}
      <div className="mt-8 flex items-center justify-between w-full max-w-[500px] text-gray-500 text-xs font-mono">
        <div className="flex items-center space-x-4">
           <div className="flex flex-col items-center">
              <span className="mb-1">MOVE</span>
              <div className="flex gap-1">
                 <span className="border border-gray-700 px-2 py-1 rounded bg-gray-900">WASD</span>
              </div>
           </div>
           <div className="h-8 w-px bg-gray-800"></div>
           <div className="flex flex-col items-center">
              <span className="mb-1">DASH</span>
              <div className="flex gap-1">
                 <span className={`border px-2 py-1 rounded transition-colors duration-200 flex items-center gap-1 ${isDashing ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-gray-700 bg-gray-900'}`}>
                    SPACE <LightningIcon />
                 </span>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === GameStatus.PLAYING ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span>{status === GameStatus.PLAYING ? 'SYSTEM ONLINE' : 'SYSTEM IDLE'}</span>
        </div>
      </div>
    </div>
  );
};

export default App;