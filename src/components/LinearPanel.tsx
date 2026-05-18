// Desenvolvido por L. A. Leandro - São José dos Campos - SP - 18/05/2026
import { useState, useCallback, useEffect, useRef } from 'react';
import { Stack } from '../utils/stack';
import { Queue } from '../utils/queue';
import { getSpeedMs, type AnimationSpeed } from '../utils/animation';
import { Plus, Minus, RotateCcw, ArrowDown, ArrowUp } from 'lucide-react';

interface LinearPanelProps {
  type: 'stack' | 'queue';
  speed: AnimationSpeed;
}

interface AnimState {
  items: number[];
  highlighted: number | null;
  isAnimating: boolean;
  message: string;
}

export function LinearPanel({ type, speed }: LinearPanelProps) {
  const [inputVal, setInputVal] = useState('');
  const [animState, setAnimState] = useState<AnimState>({
    items: [],
    highlighted: null,
    isAnimating: false,
    message: '',
  });
  const stackRef = useRef(new Stack<number>());
  const queueRef = useRef(new Queue<number>());
  const timerRef = useRef<number | null>(null);

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

  const pushOrEnqueue = useCallback(() => {
    if (animState.isAnimating) return;
    const val = Number(inputVal);
    if (isNaN(val)) return;
    setInputVal('');

    if (type === 'stack') {
      stackRef.current.push(val);
    } else {
      queueRef.current.enqueue(val);
    }

    const ms = getSpeedMs(speed);
    setAnimState({
      items: type === 'stack' ? stackRef.current.toArray() : queueRef.current.toArray(),
      highlighted: type === 'stack' ? stackRef.current.size() - 1 : queueRef.current.size() - 1,
      isAnimating: true,
      message: `Push(${val}) — O(1)`,
    });

    timerRef.current = window.setTimeout(() => {
      setAnimState((s) => ({ ...s, highlighted: null, isAnimating: false, message: '' }));
    }, ms);
  }, [inputVal, type, speed, animState.isAnimating]);

  const popOrDequeue = useCallback(() => {
    if (animState.isAnimating) return;

    let removed: number | undefined;
    if (type === 'stack') {
      removed = stackRef.current.pop();
    } else {
      removed = queueRef.current.dequeue();
    }

    if (removed === undefined) {
      setAnimState({ items: [], highlighted: null, isAnimating: false, message: 'Estrutura vazia!' });
      return;
    }

    const ms = getSpeedMs(speed);
    const currentItems = type === 'stack' ? stackRef.current.toArray() : queueRef.current.toArray();
    setAnimState({
      items: currentItems,
      highlighted: null,
      isAnimating: true,
      message: `${type === 'stack' ? 'Pop' : 'Dequeue'}(${removed}) — O(1)`,
    });

    timerRef.current = window.setTimeout(() => {
      setAnimState((s) => ({ ...s, isAnimating: false, message: '' }));
    }, ms);
  }, [type, speed, animState.isAnimating]);

  const handleClear = useCallback(() => {
    clearTimers();
    stackRef.current.clear();
    queueRef.current.clear();
    setAnimState({ items: [], highlighted: null, isAnimating: false, message: 'Estrutura limpa!' });
  }, [clearTimers]);

  const isStack = type === 'stack';
  const label = isStack ? 'Pilha' : 'Fila';

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-200">{label}</h2>
        <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">
          {isStack ? 'LIFO' : 'FIFO'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && pushOrEnqueue()}
          placeholder="Valor numérico"
          className="w-32 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={pushOrEnqueue}
          disabled={animState.isAnimating}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-sm transition-colors"
        >
          <Plus size={16} />
          {isStack ? 'Push' : 'Enqueue'}
        </button>
        <button
          onClick={popOrDequeue}
          disabled={animState.isAnimating}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-sm transition-colors"
        >
          <Minus size={16} />
          {isStack ? 'Pop' : 'Dequeue'}
        </button>
        <button
          onClick={handleClear}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm transition-colors"
        >
          <RotateCcw size={14} />
          Limpar
        </button>
      </div>

      {animState.message && (
        <div className="text-sm font-mono text-blue-300 bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-900/50 inline-block w-fit">
          {animState.message}
        </div>
      )}

      <div className="flex-1 bg-gray-900/50 rounded-xl border border-gray-800 p-4 overflow-auto">
        {animState.items.length === 0 ? (
          <p className="text-gray-600 text-sm text-center mt-8">Estrutura vazia — adicione elementos</p>
        ) : (
          <div className={`flex ${isStack ? 'flex-col-reverse' : 'flex-row flex-wrap gap-2'} items-center justify-center min-h-[200px]`}>
            {animState.items.map((item, idx) => {
              const isHighlighted = animState.highlighted === idx;
              const isTop = isStack && idx === animState.items.length - 1;
              const isFront = !isStack && idx === 0;
              return (
                <div key={`${item}-${idx}`} className="flex flex-col items-center">
                  {isStack && isTop && <ArrowDown size={14} className="text-blue-400 mb-1" />}
                  <div
                    className={`w-20 h-14 flex items-center justify-center rounded-lg border-2 text-sm font-mono font-bold transition-all duration-300 ${
                      isHighlighted
                        ? 'border-blue-400 bg-blue-600/30 text-blue-200 scale-110 shadow-lg shadow-blue-500/20'
                        : 'border-gray-700 bg-gray-800 text-gray-300'
                    }`}
                  >
                    {item}
                  </div>
                  {!isStack && isFront && <ArrowUp size={14} className="text-amber-400 mt-1" />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-600 font-mono">
        Tamanho: {animState.items.length}
      </div>
    </div>
  );
}
