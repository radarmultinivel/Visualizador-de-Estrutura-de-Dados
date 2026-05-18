// Desenvolvido por L. A. Leandro - São José dos Campos - SP - 18/05/2026
export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface BFSStep {
  visited: string[];
  current: string | null;
  queue: string[];
}

export class Graph {
  nodes: GraphNode[] = [];
  edges: GraphEdge[] = [];

  addNode(label: string): string {
    const id = `n${this.nodes.length}`;
    const angle = (this.nodes.length / 8) * Math.PI * 2;
    const cx = 400;
    const cy = 300;
    const radius = 200;
    this.nodes.push({
      id,
      label,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
    return id;
  }

  addEdge(from: string, to: string): void {
    if (from === to) return;
    const exists = this.edges.some(
      (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );
    if (!exists) {
      this.edges.push({ from, to });
    }
  }

  getNeighbors(nodeId: string): string[] {
    const neighbors: string[] = [];
    for (const edge of this.edges) {
      if (edge.from === nodeId) neighbors.push(edge.to);
      if (edge.to === nodeId) neighbors.push(edge.from);
    }
    return neighbors;
  }

  bfs(startId: string): BFSStep[] {
    const steps: BFSStep[] = [];
    const visited = new Set<string>();
    const queue: string[] = [startId];
    visited.add(startId);

    steps.push({ visited: [startId], current: null, queue: [...queue] });

    while (queue.length > 0) {
      const current = queue.shift()!;
      steps.push({ visited: Array.from(visited), current, queue: [...queue] });

      for (const neighbor of this.getNeighbors(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    steps.push({ visited: Array.from(visited), current: null, queue: [] });
    return steps;
  }

  dfs(startId: string): BFSStep[] {
    const steps: BFSStep[] = [];
    const visited = new Set<string>();
    const stack: string[] = [startId];

    visited.add(startId);
    steps.push({ visited: [startId], current: null, queue: [...stack] });

    while (stack.length > 0) {
      const current = stack.pop()!;
      steps.push({ visited: Array.from(visited), current, queue: [...stack] });

      for (const neighbor of this.getNeighbors(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          stack.push(neighbor);
        }
      }
    }

    steps.push({ visited: Array.from(visited), current: null, queue: [] });
    return steps;
  }

  clear(): void {
    this.nodes = [];
    this.edges = [];
  }
}
