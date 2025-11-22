import React, { useState } from 'react';
import { TaiChiExperience } from './components/TaiChiExperience';
import { Sparkles, Circle, Maximize2, Minimize2 } from 'lucide-react';

const App: React.FC = () => {
  // 'scatter' = random movement, 'form' = tai chi shape
  const [mode, setMode] = useState<'scatter' | 'form'>('form');

  return (
    <div className="relative w-full h-full bg-slate-500 text-white overflow-hidden">
      
      {/* 3D Scene Container */}
      <div className="absolute inset-0 z-0">
        <TaiChiExperience mode={mode} />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-12">
        
        {/* Header */}
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-6xl font-thin tracking-tighter text-white drop-shadow-md">
            TAI CHI <span className="font-bold">VOLUMETRIC</span>
          </h1>
          <p className="text-white/90 max-w-md text-sm md:text-base font-medium drop-shadow-sm">
            A 3D spherical volume where thousands of particles find balance between chaos and order.
          </p>
        </header>

        {/* Controls (Sticky Bottom) */}
        <div className="pointer-events-auto flex flex-col md:flex-row gap-4 items-start md:items-end">
          
          {/* Updated buttons to use darker glass for better contrast on grey bg */}
          <div className="bg-black/20 backdrop-blur-md border border-white/20 p-2 rounded-2xl flex gap-2 shadow-2xl">
            <button
              onClick={() => setMode('scatter')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                mode === 'scatter' 
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                  : 'hover:bg-black/20 text-white/90'
              }`}
            >
              <Sparkles size={18} />
              <span>Disperse</span>
            </button>
            
            <button
              onClick={() => setMode('form')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                mode === 'form' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                  : 'hover:bg-black/20 text-white/90'
              }`}
            >
              <Circle size={18} />
              <span>Coalesce</span>
            </button>
          </div>

          <div className="hidden md:block bg-black/20 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl text-xs text-white/80 font-medium shadow-lg">
            Drag to rotate • Scroll to zoom
          </div>
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-0 right-0 p-10 opacity-40 pointer-events-none text-white">
        <Maximize2 size={48} strokeWidth={1} />
      </div>
      <div className="absolute bottom-0 left-0 p-10 opacity-40 pointer-events-none text-white">
        <Minimize2 size={48} strokeWidth={1} />
      </div>
    </div>
  );
};

export default App;