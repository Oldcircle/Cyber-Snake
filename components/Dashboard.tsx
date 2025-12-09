import React, { useState } from 'react';
import { GameRecord, Language, SkinConfig, ThemeConfig } from '../types';
import { TRANSLATIONS, SKINS, THEMES } from '../constants';

interface DashboardProps {
  onBack: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currentSkin: SkinConfig;
  setSkin: (skin: SkinConfig) => void;
  currentTheme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  history: GameRecord[];
  onClearData: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onBack,
  language,
  setLanguage,
  currentSkin,
  setSkin,
  currentTheme,
  setTheme,
  history,
  onClearData
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'history'>('settings');
  const t = TRANSLATIONS[language];

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(language === 'en' ? 'en-US' : 'zh-CN');
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#050510] flex flex-col font-mono">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0a0a1a]">
        <h2 className="text-2xl font-bold text-cyan-400 tracking-wider flex items-center gap-2">
          <span className="w-2 h-6 bg-purple-500 block"></span>
          {t.dashboard.title}
        </h2>
        <button 
          onClick={onBack}
          className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm"
        >
          ← {t.dashboard.back}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 text-sm font-bold tracking-widest transition-colors ${
            activeTab === 'settings' 
              ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {t.dashboard.tabs.settings}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-sm font-bold tracking-widest transition-colors ${
            activeTab === 'history' 
              ? 'bg-purple-500/10 text-purple-400 border-b-2 border-purple-400' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {t.dashboard.tabs.history}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-lg mx-auto">
            
            {/* Language Section */}
            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-widest mb-3">{t.dashboard.settings.language}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLanguage('en')}
                  className={`p-3 rounded border transition-all ${
                    language === 'en' 
                      ? 'border-cyan-500 bg-cyan-500/20 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                      : 'border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-500'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('zh')}
                  className={`p-3 rounded border transition-all ${
                    language === 'zh' 
                      ? 'border-cyan-500 bg-cyan-500/20 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                      : 'border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-500'
                  }`}
                >
                  中文
                </button>
              </div>
            </div>

            {/* Skins Section */}
            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-widest mb-3">{t.dashboard.settings.skin}</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(SKINS).map(skin => (
                  <button
                    key={skin.id}
                    onClick={() => setSkin(skin)}
                    className={`p-3 rounded border transition-all flex items-center gap-3 ${
                      currentSkin.id === skin.id
                        ? 'border-purple-500 bg-purple-500/20 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                        : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${skin.headClass.split(' ')[0]}`}></div>
                    <span className="text-sm font-bold">{skin.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Section */}
            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-widest mb-3">{t.dashboard.settings.theme}</label>
              <div className="grid grid-cols-1 gap-3">
                {Object.values(THEMES).map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme)}
                    className={`p-4 rounded border transition-all text-left ${
                      currentTheme.id === theme.id
                        ? 'border-cyan-500 bg-cyan-900/20 text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                        : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-sm font-bold mb-1">{theme.name}</div>
                    <div className="flex gap-1">
                      <div className={`h-2 w-8 rounded ${theme.bgClass} border border-gray-500`}></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-800">
               <button 
                  onClick={() => {
                      if(window.confirm(language === 'en' ? 'Are you sure?' : '确定要清除所有数据吗？')) {
                          onClearData();
                      }
                  }}
                  className="text-red-500 text-sm hover:text-red-400 underline"
               >
                  {t.dashboard.settings.clearData}
               </button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="max-w-lg mx-auto">
            {history.length === 0 ? (
              <div className="text-center text-gray-600 py-10 italic">
                {t.dashboard.history.empty}
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-4 bg-gray-900/50 border border-gray-800 rounded hover:border-gray-600 transition-colors">
                     <div className="text-xs text-gray-500 font-mono">
                       {formatDate(record.date)}
                     </div>
                     <div className="text-xl font-bold text-cyan-400 font-mono">
                       {record.score}
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};