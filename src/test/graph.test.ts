// Desenvolvido por L. A. Leandro - São José dos Campos - SP - 18/05/2026
import { describe, it, expect } from 'vitest';
import { Graph } from '../utils/graph';

describe('Graph', () => {
  it('starts empty', () => {
    const graph = new Graph();
    expect(graph.nodes).toEqual([]);
    expect(graph.edges).toEqual([]);
  });

  it('adds nodes', () => {
    const graph = new Graph();
    graph.addNode('A');
    graph.addNode('B');
    expect(graph.nodes.length).toBe(2);
    expect(graph.nodes[0].label).toBe('A');
    expect(graph.nodes[1].label).toBe('B');
  });

  it('adds edges', () => {
    const graph = new Graph();
    const idA = graph.addNode('A');
    const idB = graph.addNode('B');
    graph.addEdge(idA, idB);
    expect(graph.edges.length).toBe(1);
    expect(graph.edges[0]).toEqual({ from: idA, to: idB });
  });

  it('does not add duplicate edges', () => {
    const graph = new Graph();
    const idA = graph.addNode('A');
    const idB = graph.addNode('B');
    graph.addEdge(idA, idB);
    graph.addEdge(idA, idB);
    expect(graph.edges.length).toBe(1);
  });

  it('does not add self-loop', () => {
    const graph = new Graph();
    const idA = graph.addNode('A');
    graph.addEdge(idA, idA);
    expect(graph.edges.length).toBe(0);
  });

  it('gets neighbors', () => {
    const graph = new Graph();
    const idA = graph.addNode('A');
    const idB = graph.addNode('B');
    const idC = graph.addNode('C');
    graph.addEdge(idA, idB);
    graph.addEdge(idA, idC);
    const neighbors = graph.getNeighbors(idA);
    expect(neighbors).toContain(idB);
    expect(neighbors).toContain(idC);
    expect(neighbors.length).toBe(2);
  });

  it('bfs visits all nodes', () => {
    const graph = new Graph();
    const idA = graph.addNode('A');
    const idB = graph.addNode('B');
    const idC = graph.addNode('C');
    graph.addEdge(idA, idB);
    graph.addEdge(idB, idC);
    const steps = graph.bfs(idA);
    const last = steps[steps.length - 1];
    expect(last.visited.length).toBe(3);
    expect(last.current).toBeNull();
  });

  it('dfs visits all nodes', () => {
    const graph = new Graph();
    const idA = graph.addNode('A');
    const idB = graph.addNode('B');
    const idC = graph.addNode('C');
    graph.addEdge(idA, idB);
    graph.addEdge(idB, idC);
    const steps = graph.dfs(idA);
    const last = steps[steps.length - 1];
    expect(last.visited.length).toBe(3);
    expect(last.current).toBeNull();
  });

  it('clear removes all nodes and edges', () => {
    const graph = new Graph();
    graph.addNode('A');
    graph.addNode('B');
    graph.addEdge(graph.nodes[0].id, graph.nodes[1].id);
    graph.clear();
    expect(graph.nodes).toEqual([]);
    expect(graph.edges).toEqual([]);
  });
});
