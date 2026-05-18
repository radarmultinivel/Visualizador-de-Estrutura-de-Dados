// Desenvolvido por L. A. Leandro - São José dos Campos - SP - 18/05/2026
import { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { LinearPanel } from './components/LinearPanel';
import { BSTPanel } from './components/BSTPanel';
import { GraphPanel } from './components/GraphPanel';
import type { AnimationSpeed } from './utils/animation';

export type Module = 'stack' | 'queue' | 'bst' | 'graph';

export default function App() {
  const [module, setModule] = useState<Module>('bst');
  const [speed, setSpeed] = useState<AnimationSpeed>('normal');
  const [resetKey, setResetKey] = useState(0);

  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="border-b border-gray-800 px-6 py-3 flex items-center gap-3 bg-gray-900/50">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-blue-400">Estrutura</span>
          <span className="text-gray-400">Viz</span>
          <span className="text-[10px] text-gray-600 ml-2 font-mono">v1.0</span>
        </h1>
        <span className="text-xs text-gray-500 hidden sm:inline">Laboratório Visual de Estruturas de Dados</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <ControlPanel
          module={module}
          onModuleChange={setModule}
          speed={speed}
          onSpeedChange={setSpeed}
          onReset={handleReset}
        />
        <main className="flex-1 overflow-auto p-4">
          {module === 'stack' && <LinearPanel key={`stack-${resetKey}`} type="stack" speed={speed} />}
          {module === 'queue' && <LinearPanel key={`queue-${resetKey}`} type="queue" speed={speed} />}
          {module === 'bst' && <BSTPanel key={`bst-${resetKey}`} speed={speed} />}
          {module === 'graph' && <GraphPanel key={`graph-${resetKey}`} speed={speed} />}
        </main>
      </div>
    </div>
  );
}
