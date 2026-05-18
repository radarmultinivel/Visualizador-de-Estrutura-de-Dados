// Desenvolvido por L. A. Leandro - São José dos Campos - SP - 18/05/2026
import type { Module } from '../App';
import type { AnimationSpeed } from '../utils/animation';
import {
  Layers,
  ArrowRightFromLine,
  GitBranch,
  Network,
  RotateCcw,
} from 'lucide-react';

interface ControlPanelProps {
  module: Module;
  onModuleChange: (m: Module) => void;
  speed: AnimationSpeed;
  onSpeedChange: (s: AnimationSpeed) => void;
  onReset: () => void;
}

const modules: { id: Module; label: string; icon: React.ReactNode }[] = [
  { id: 'stack', label: 'Pilha', icon: <Layers size={18} /> },
  { id: 'queue', label: 'Fila', icon: <ArrowRightFromLine size={18} /> },
  { id: 'bst', label: 'Árvore BST', icon: <GitBranch size={18} /> },
  { id: 'graph', label: 'Grafo', icon: <Network size={18} /> },
];

export function ControlPanel({ module, onModuleChange, speed, onSpeedChange, onReset }: ControlPanelProps) {
  return (
    <aside className="w-56 border-r border-gray-800 bg-gray-900/30 p-4 flex flex-col gap-5 shrink-0 overflow-y-auto">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Módulo</p>
        <div className="flex flex-col gap-1">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => onModuleChange(m.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                module === m.id
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-700/50'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Velocidade</p>
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min="0"
            max="2"
            step="1"
            value={speed === 'slow' ? 0 : speed === 'normal' ? 1 : 2}
            onChange={(e) => {
              const v = Number(e.target.value);
              onSpeedChange(v === 0 ? 'slow' : v === 1 ? 'normal' : 'fast');
            }}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Lenta</span>
            <span>Rápida</span>
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors border border-gray-700"
      >
        <RotateCcw size={16} />
        Reset
      </button>

      <div className="mt-auto border-t border-gray-800 pt-4 text-xs text-gray-600">
        <p className="mb-1">Legenda:</p>
        <div className="space-y-1">
          {module === 'bst' && (
            <>
              <p><span className="inline-block w-3 h-3 rounded-full bg-blue-500 align-middle mr-1" /> Caminho percorrido</p>
              <p><span className="inline-block w-3 h-3 rounded-full bg-emerald-400 align-middle mr-1" /> Nó encontrado</p>
            </>
          )}
          {module === 'graph' && (
            <>
              <p><span className="inline-block w-3 h-3 rounded-full bg-amber-400 align-middle mr-1" /> Visitando</p>
              <p><span className="inline-block w-3 h-3 rounded-full bg-emerald-500 align-middle mr-1" /> Visitado</p>
            </>
          )}
          {(module === 'stack' || module === 'queue') && (
            <p><span className="inline-block w-3 h-3 rounded bg-blue-500 align-middle mr-1" /> Elemento ativo</p>
          )}
        </div>
      </div>
    </aside>
  );
}
