// Desenvolvido por L. A. Leandro - São José dos Campos - SP - 18/05/2026
import { useState, useCallback, useRef, useEffect } from 'react';
import { Graph, type GraphNode, type GraphEdge, type BFSStep } from '../utils/graph';
import { getSpeedMs, type AnimationSpeed } from '../utils/animation';
import { Play, RotateCcw, Link2 } from 'lucide-react';

interface GraphPanelProps {
  speed: AnimationSpeed;
}

type GraphAnimState =
  | { phase: 'idle' }
  | { phase: 'playing'; steps: BFSStep[]; currentStep: number }
  | { phase: 'done'; message: string };

export function GraphPanel({ speed }: GraphPanelProps) {
  const graphRef = useRef(new Graph());
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [labelInput, setLabelInput] = useState('');
  const [animState, setAnimState] = useState<GraphAnimState>({ phase: 'idle' });
  const timerRef = useRef<number | null>(null);

  const refresh = useCallback(() => {
    const g = graphRef.current;
    setNodes([...g.nodes]);
    setEdges([...g.edges]);
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

  const handleAddNode = useCallback(() => {
    if (animState.phase !== 'idle') return;
    const label = labelInput.trim() || String(nodes.length);
    setLabelInput('');
    graphRef.current.addNode(label);
    refresh();
    setAnimState({ phase: 'done', message: `Nó ${label} adicionado` });
    const ms = getSpeedMs(speed);
    timerRef.current = window.setTimeout(() => setAnimState({ phase: 'idle' }), ms);
  }, [labelInput, nodes.length, animState.phase, speed, refresh]);

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (animState.phase !== 'idle') return;
      if (selectedId === null) {
        setSelectedId(nodeId);
      } else if (selectedId === nodeId) {
        setSelectedId(null);
      } else {
        graphRef.current.addEdge(selectedId, nodeId);
        setSelectedId(null);
        refresh();
        setAnimState({ phase: 'done', message: 'Aresta criada!' });
        const ms = getSpeedMs(speed);
        timerRef.current = window.setTimeout(() => setAnimState({ phase: 'idle' }), ms);
      }
    },
    [selectedId, animState.phase, speed, refresh]
  );

  const handleRunBFS = useCallback(() => {
    if (animState.phase !== 'idle') return;
    const g = graphRef.current;
    if (g.nodes.length === 0) return;
    const startId = g.nodes[0].id;
    const steps = g.bfs(startId);
    if (steps.length === 0) return;

    setAnimState({ phase: 'playing', steps, currentStep: 0 });
    const ms = getSpeedMs(speed);

    let stepIdx = 0;
    const advance = () => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setAnimState({ phase: 'playing', steps, currentStep: stepIdx });
        timerRef.current = window.setTimeout(advance, ms);
      } else {
        setAnimState({ phase: 'done', message: 'BFS concluída! Complexidade: O(V + E)' });
        timerRef.current = window.setTimeout(() => setAnimState({ phase: 'idle' }), ms);
      }
    };
    timerRef.current = window.setTimeout(advance, ms);
  }, [animState.phase, speed]);

  const handleRunDFS = useCallback(() => {
    if (animState.phase !== 'idle') return;
    const g = graphRef.current;
    if (g.nodes.length === 0) return;
    const startId = g.nodes[0].id;
    const steps = g.dfs(startId);

    setAnimState({ phase: 'playing', steps, currentStep: 0 });
    const ms = getSpeedMs(speed);

    let stepIdx = 0;
    const advance = () => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setAnimState({ phase: 'playing', steps, currentStep: stepIdx });
        timerRef.current = window.setTimeout(advance, ms);
      } else {
        setAnimState({ phase: 'done', message: 'DFS concluída! Complexidade: O(V + E)' });
        timerRef.current = window.setTimeout(() => setAnimState({ phase: 'idle' }), ms);
      }
    };
    timerRef.current = window.setTimeout(advance, ms);
  }, [animState.phase, speed]);

  const handleClear = useCallback(() => {
    clearTimers();
    graphRef.current.clear();
    setSelectedId(null);
    refresh();
    setAnimState({ phase: 'idle' });
  }, [clearTimers, refresh]);

  const visitedSet = new Set(
    animState.phase === 'playing' ? animState.steps[animState.currentStep]?.visited ?? [] : []
  );
  const currentVisiting =
    animState.phase === 'playing' ? animState.steps[animState.currentStep]?.current ?? null : null;
  const queueItems =
    animState.phase === 'playing' ? animState.steps[animState.currentStep]?.queue ?? [] : [];

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-200">Grafo</h2>
        <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">BFS / DFS</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={labelInput}
          onChange={(e) => setLabelInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddNode()}
          placeholder="Rótulo do nó"
          className="w-28 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          disabled={animState.phase !== 'idle'}
        />
        <button
          onClick={handleAddNode}
          disabled={animState.phase !== 'idle'}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-sm transition-colors"
        >
          <Link2 size={16} />
          Adicionar Nó
        </button>

        <button
          onClick={handleRunBFS}
          disabled={animState.phase !== 'idle'}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-sm transition-colors"
        >
          <Play size={16} />
          BFS
        </button>

        <button
          onClick={handleRunDFS}
          disabled={animState.phase !== 'idle'}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 disabled:opacity-40 text-sm transition-colors"
        >
          <Play size={16} />
          DFS
        </button>

        <button
          onClick={handleClear}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm transition-colors"
        >
          <RotateCcw size={14} />
          Limpar
        </button>

        {selectedId && (
          <span className="text-xs text-amber-400 bg-amber-950/40 px-2 py-1 rounded">
            Selecione o nó de destino para criar aresta
          </span>
        )}
      </div>

      {animState.phase === 'done' && (
        <div className="text-sm font-mono text-blue-300 bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-900/50 inline-block w-fit">
          {animState.message}
        </div>
      )}

      {animState.phase === 'playing' && (
        <div className="text-sm font-mono text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-900/50 inline-block w-fit">
          {queueItems.length > 0
            ? `Fila/Pilha: [${queueItems
                .map((id) => nodes.find((n) => n.id === id)?.label ?? id)
                .join(', ')}]`
            : 'Processando...'}
        </div>
      )}

      <div className="flex-1 bg-gray-900/50 rounded-xl border border-gray-800 p-2 overflow-auto">
        {nodes.length === 0 ? (
          <p className="text-gray-600 text-sm text-center mt-16">
            Grafo vazio — adicione nós e clique em dois nós para criar arestas
          </p>
        ) : (
          <svg viewBox="0 0 800 600" className="w-full h-full min-h-[350px]">
            {edges.map((edge) => {
              const from = nodes.find((n) => n.id === edge.from);
              const to = nodes.find((n) => n.id === edge.to);
              if (!from || !to) return null;
              const bothVisited = visitedSet.has(edge.from) && visitedSet.has(edge.to);
              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={bothVisited ? '#34d399' : '#374151'}
                  strokeWidth={bothVisited ? 2.5 : 1.5}
                />
              );
            })}
            {nodes.map((node) => {
              const isVisited = visitedSet.has(node.id);
              const isCurrent = currentVisiting === node.id;
              const isSelected = selectedId === node.id;

              let fill = '#1f2937';
              let stroke = '#4b5563';
              let textFill = '#d1d5db';

              if (isCurrent) {
                fill = '#f59e0b';
                stroke = '#fbbf24';
                textFill = '#fff';
              } else if (isVisited) {
                fill = '#059669';
                stroke = '#34d399';
                textFill = '#fff';
              }
              if (isSelected) {
                stroke = '#60a5fa';
                fill = '#1e3a5f';
              }

              return (
                <g
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  style={{ cursor: animState.phase === 'idle' ? 'pointer' : 'default' }}
                  className="transition-all duration-200"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={28}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={2.5}
                    className={isCurrent ? 'animate-pulse' : ''}
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textFill}
                    className="text-xs font-bold font-mono"
                    fontSize={13}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
