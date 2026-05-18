// Desenvolvido por L. A. Leandro - São José dos Campos - SP - 18/05/2026
import { describe, it, expect } from 'vitest';
import { BST } from '../utils/bst';

describe('BST', () => {
  it('starts empty', () => {
    const bst = new BST();
    expect(bst.root).toBeNull();
  });

  it('inserts a single node as root', () => {
    const bst = new BST();
    bst.insert(10);
    expect(bst.root?.value).toBe(10);
  });

  it('inserts smaller values to the left', () => {
    const bst = new BST();
    bst.insert(10);
    bst.insert(5);
    expect(bst.root?.left?.value).toBe(5);
    expect(bst.root?.right).toBeNull();
  });

  it('inserts larger values to the right', () => {
    const bst = new BST();
    bst.insert(10);
    bst.insert(15);
    expect(bst.root?.right?.value).toBe(15);
    expect(bst.root?.left).toBeNull();
  });

  it('inserts multiple levels correctly', () => {
    const bst = new BST();
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);
    bst.insert(3);
    bst.insert(7);
    bst.insert(12);
    bst.insert(18);
    expect(bst.root?.left?.left?.value).toBe(3);
    expect(bst.root?.left?.right?.value).toBe(7);
    expect(bst.root?.right?.left?.value).toBe(12);
    expect(bst.root?.right?.right?.value).toBe(18);
  });

  it('ignores duplicate values', () => {
    const bst = new BST();
    bst.insert(10);
    bst.insert(10);
    expect(bst.inOrder()).toEqual([10]);
  });

  it('deletes a leaf node', () => {
    const bst = new BST();
    bst.insert(10);
    bst.insert(5);
    bst.delete(5);
    expect(bst.root?.left).toBeNull();
  });

  it('deletes a node with one child', () => {
    const bst = new BST();
    bst.insert(10);
    bst.insert(5);
    bst.insert(3);
    bst.delete(5);
    expect(bst.root?.left?.value).toBe(3);
  });

  it('deletes a node with two children', () => {
    const bst = new BST();
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);
    bst.insert(3);
    bst.insert(7);
    bst.delete(5);
    expect(bst.root?.left?.value).toBe(7);
    expect(bst.root?.left?.left?.value).toBe(3);
  });

  it('searches and returns path steps', () => {
    const bst = new BST();
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);
    bst.insert(3);
    const steps = bst.search(3);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[steps.length - 1].found).toBe(true);
  });

  it('search returns empty for missing value', () => {
    const bst = new BST();
    bst.insert(10);
    const steps = bst.search(99);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[steps.length - 1].found).toBe(false);
  });

  it('clears the tree', () => {
    const bst = new BST();
    bst.insert(10);
    bst.insert(5);
    bst.clear();
    expect(bst.root).toBeNull();
  });

  it('inOrder returns sorted values', () => {
    const bst = new BST();
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);
    bst.insert(3);
    bst.insert(7);
    expect(bst.inOrder()).toEqual([3, 5, 7, 10, 15]);
  });
});
