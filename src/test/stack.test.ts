// Desenvolvido por L. A. Leandro - São José dos Campos - SP - 18/05/2026
import { describe, it, expect } from 'vitest';
import { Stack } from '../utils/stack';

describe('Stack', () => {
  it('starts empty', () => {
    const stack = new Stack<number>();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);
  });

  it('pushes items', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    expect(stack.size()).toBe(2);
    expect(stack.isEmpty()).toBe(false);
  });

  it('pops items in LIFO order', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
    expect(stack.isEmpty()).toBe(true);
  });

  it('peek returns top without removing', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    expect(stack.peek()).toBe(2);
    expect(stack.size()).toBe(2);
  });

  it('pop returns undefined on empty stack', () => {
    const stack = new Stack<number>();
    expect(stack.pop()).toBeUndefined();
  });

  it('clear empties the stack', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    stack.clear();
    expect(stack.isEmpty()).toBe(true);
  });

  it('toArray returns a copy', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    const arr = stack.toArray();
    expect(arr).toEqual([1, 2]);
    arr.push(3);
    expect(stack.size()).toBe(2);
  });
});
