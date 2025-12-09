import React from 'react';
import { GameStatus, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface GameOverlayProps {
  status: GameStatus;
  score: number;
  highScore: number;
  onStart: () => void;
  onResume: () => void;
  onGoToDashboard: () => void;
  language: Language;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({ 
  status, 
  score, 
  highScore, 
  onStart, 
  onResume,
  onGoToDashboard,
  language
}) => {
  const t = TRANSLATIONS[language];

  if (status === GameStatus.PLAYING) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-xl transition-all duration-300">
      <div className="text-center p-8 border border-white/10 bg-[#050510]/90 rounded-2xl shadow-[0_0_30px_rgba(0,243,255,0.2)] max-w-sm w-full mx-4">
        
        {status === GameStatus.IDLE && (
          <>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2 tracking-tighter filter drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
              {t.title}
            </h1>
            <p className="text-cyan-300 mb-6 font-bold tracking-widest text-xs uppercase">{t.subtitle}</p>
            
            <div className="mb-8 space-y-2 text-sm text-gray-400">
              <p>{t.controls.move}</p>
              <p>{t.controls.dash}</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={onStart}
                className="group relative px-8 py-3 bg-cyan-500/10 border border-cyan-500 text-cyan-400 font-bold rounded hover:bg-cyan-500 hover:text-black transition-all duration-200 overflow-hidden w-full"
              >
                <span className="relative z-10">{t.menu.start}</span>
                <div className="absolute inset-0 h-full w-full scale-0 rounded transition-all duration-300 group-hover:scale-100 group-hover:bg-cyan-500"></div>
              </button>

              <button 
                onClick={onGoToDashboard}
                className="px-8 py-2 bg-transparent border border-gray-600 text-gray-400 font-bold rounded hover:border-gray-400 hover:text-white transition-all w-full text-sm"
              >
                {t.menu.dashboard}
              </button>
            </div>
          </>
        )}

        {status === GameStatus.PAUSED && (
          <>
            <h2 className="text-3xl font-bold text-white mb-6 tracking-widest">{t.menu.paused}</h2>
            <div className="space-y-3">
              <button 
                onClick={onResume}
                className="px-8 py-3 bg-transparent border-2 border-purple-500 text-purple-500 font-bold rounded hover:bg-purple-500 hover:text-white transition-all shadow-[0_0_15px_rgba(188,19,254,0.3)] w-full"
              >
                {t.menu.resume}
              </button>
              
              <button 
                onClick={onStart}
                className="px-8 py-2 text-gray-400 hover:text-white text-sm"
              >
                {t.menu.reboot}
              </button>
              
              <button 
                onClick={onGoToDashboard}
                className="px-8 py-2 text-gray-400 hover:text-white text-sm block w-full"
              >
                {t.menu.dashboard}
              </button>
            </div>
          </>
        )}

        {status === GameStatus.GAME_OVER && (
          <>
            <h2 className="text-4xl font-black text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(255,0,85,0.8)]">{t.menu.gameOver}</h2>
            <div className="my-6 space-y-2">
              <div className="text-gray-400 text-xs uppercase tracking-widest">{t.menu.finalScore}</div>
              <div className="text-5xl font-mono text-white font-bold">{score}</div>
              {score > 0 && score >= highScore && (
                 <div className="text-yellow-400 text-xs font-bold animate-pulse">{t.menu.newHighScore}</div>
              )}
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={onStart}
                className="px-8 py-3 bg-red-600/20 border border-red-500 text-red-500 font-bold rounded hover:bg-red-600 hover:text-white transition-all shadow-neon-red w-full"
              >
                {t.menu.reboot}
              </button>

              <button 
                onClick={onGoToDashboard}
                className="px-8 py-2 bg-transparent border border-gray-600 text-gray-400 font-bold rounded hover:border-gray-400 hover:text-white transition-all w-full text-sm"
              >
                {t.menu.dashboard}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};