// Desenvolvido por L. A. Leandro - São José dos Campos - SP - 18/05/2026
import { useState, useCallback, useRef, useEffect } from 'react';
import { BST, computeBSTLayout, type BSTLayoutNode, type BSTSearchStep } from '../utils/bst';
import { getSpeedMs, type AnimationSpeed } from '../utils/animation';
import { Plus, Search, RotateCcw } from 'lucide-react';

interface BSTPanelProps {
  speed: AnimationSpeed;
}

type BSTAnimState =
  | { phase: 'idle' }
  | { phase: 'searching'; steps: BSTSearchStep[]; currentStep: number; searchValue: number }
  | { phase: 'done'; message: string };

const SVG_W = 700;
const SVG_H = 450;

function renderBST(
  node: BSTLayoutNode | null,
  animState: BSTAnimState,
  searchValue: number | null
): React.ReactNode {
  if (!node) return null;

  const edges: React.ReactNode[] = [];
  const nodes: React.ReactNode[] = [];

  function traverse(n: BSTLayoutNode) {
    const isFound = animState.phase === 'searching' && animState.steps[animState.currentStep]?.found && n.value === searchValue;
    const visited = animState.phase === 'searching' && animState.steps.slice(0, animState.currentStep + 1).some((s) => s.node.value === n.value);
    const isCurrent = animState.phase === 'searching' && animState.steps[animState.currentStep]?.node.value === n.value;

    if (n.left) {
      edges.push(
        <line
          key={`e-${n.value}-${n.left.value}`}
          x1={n.x}
          y1={n.y}
          x2={n.left.x}
          y2={n.left.y}
          stroke={visited ? '#3b82f6' : '#374151'}
          strokeWidth={2}
        />
      );
      traverse(n.left);
    }
    if (n.right) {
      edges.push(
        <line
          key={`e-${n.value}-${n.right.value}`}
          x1={n.x}
          y1={n.y}
          x2={n.right.x}
          y2={n.right.y}
          stroke={visited ? '#3b82f6' : '#374151'}
          strokeWidth={2}
        />
      );
      traverse(n.right);
    }

    let fill = '#1f2937';
    let stroke = '#4b5563';
    let textColor = '#d1d5db';
    let extraClass = '';

    if (isFound) {
      fill = '#059669';
      stroke = '#34d399';
      textColor = '#fff';
      extraClass = 'animate-pulse';
    } else if (isCurrent) {
      fill = '#3b82f6';
      stroke = '#60a5fa';
      textColor = '#fff';
      extraClass = 'animate-pulse';
    } else if (visited) {
      stroke = '#3b82f6';
      fill = '#1e3a5f';
    }

    nodes.push(
      <g key={`n-${n.value}`}>
        <circle cx={n.x} cy={n.y} r={22} fill={fill} stroke={stroke} strokeWidth={2.5} className={extraClass} />
        <text
          x={n.x}
          y={n.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          className="text-xs font-bold font-mono"
          fontSize={13}
        >
          {n.value}
        </text>
      </g>
    );
  }

  traverse(node);
  return [...edges, ...nodes];
}

export function BSTPanel({ speed }: BSTPanelProps) {
  const [inputVal, setInputVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const bstRef = useRef(new BST());
  const [layout, setLayout] = useState<BSTLayoutNode | null>(null);
  const [animState, setAnimState] = useState<BSTAnimState>({ phase: 'idle' });
  const timerRef = useRef<number | null>(null);

  const refreshLayout = useCallback(() => {
    setLayout(computeBSTLayout(bstRef.current.root, SVG_W / 2, 40, 180, 60));
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  const clearTimers = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleInsert = useCallback(() => {
    if (animState.phase !== 'idle') return;
    const val = Number(inputVal);
    if (isNaN(val)) return;
    setInputVal('');
    bstRef.current.insert(val);
    refreshLayout();
    setAnimState({ phase: 'done', message: `Inserido(${val}) — O(log n)` });
    const ms = getSpeedMs(speed);
    timerRef.current = window.setTimeout(() => {
      setAnimState({ phase: 'idle' });
    }, ms);
  }, [inputVal, animState.phase, speed, refreshLayout]);

  const handleSearch = useCallback(() => {
    if (animState.phase !== 'idle') return;
    const val = Number(searchVal);
    if (isNaN(val)) return;
    const steps = bstRef.current.search(val);
    if (steps.length === 0) {
      setAnimState({ phase: 'done', message: 'Árvore vazia!' });
      return;
    }

    setAnimState({ phase: 'searching', steps, currentStep: 0, searchValue: val });
    const ms = getSpeedMs(speed);

    let stepIdx = 0;
    const advance = () => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setAnimState({ phase: 'searching', steps, currentStep: stepIdx, searchValue: val });
        timerRef.current = window.setTimeout(advance, ms);
      } else {
        const found = steps[steps.length - 1].found;
        setAnimState({
          phase: 'done',
          message: found ? `Valor ${val} encontrado! — O(log n)` : `Valor ${val} não encontrado — O(log n)`,
        });
        timerRef.current = window.setTimeout(() => {
          setAnimState({ phase: 'idle' });
        }, ms);
      }
    };

    timerRef.current = window.setTimeout(advance, ms);
  }, [searchVal, animState.phase, speed]);

  const handleClear = useCallback(() => {
    clearTimers();
    bstRef.current.clear();
    setLayout(null);
    setAnimState({ phase: 'idle' });
  }, [clearTimers]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-200">Árvore Binária de Busca (BST)</h2>
        <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">O(log n)</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="number"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
          placeholder="Inserir valor"
          className="w-28 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          disabled={animState.phase !== 'idle'}
        />
        <button
          onClick={handleInsert}
          disabled={animState.phase !== 'idle'}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-sm transition-colors"
        >
          <Plus size={16} />
          Inserir
        </button>

        <input
          type="number"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Buscar valor"
          className="w-28 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          disabled={animState.phase !== 'idle'}
        />
        <button
          onClick={handleSearch}
          disabled={animState.phase !== 'idle'}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-sm transition-colors"
        >
          <Search size={16} />
          Buscar
        </button>

        <button
          onClick={handleClear}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm transition-colors"
        >
          <RotateCcw size={14} />
          Limpar
        </button>
      </div>

      {animState.phase === 'done' && (
        <div className="text-sm font-mono text-blue-300 bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-900/50 inline-block w-fit">
          {animState.message}
        </div>
      )}

      <div className="flex-1 bg-gray-900/50 rounded-xl border border-gray-800 p-2 overflow-auto">
        {layout ? (
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full min-h-[300px]">
            {renderBST(layout, animState, animState.phase === 'searching' ? animState.searchValue : null)}
          </svg>
        ) : (
          <p className="text-gray-600 text-sm text-center mt-16">Árvore vazia — insira nós para visualizar</p>
        )}
      </div>
    </div>
  );
}
