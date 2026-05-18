// Desenvolvido por L. A. Leandro - São José dos Campos - SP - 18/05/2026
import { describe, it, expect } from 'vitest';
import { Queue } from '../utils/queue';

describe('Queue', () => {
  it('starts empty', () => {
    const queue = new Queue<number>();
    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
  });

  it('enqueues items', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.size()).toBe(2);
    expect(queue.isEmpty()).toBe(false);
  });

  it('dequeues items in FIFO order', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(3);
    expect(queue.isEmpty()).toBe(true);
  });

  it('front returns first without removing', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.front()).toBe(1);
    expect(queue.size()).toBe(2);
  });

  it('dequeue returns undefined on empty queue', () => {
    const queue = new Queue<number>();
    expect(queue.dequeue()).toBeUndefined();
  });

  it('clear empties the queue', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.clear();
    expect(queue.isEmpty()).toBe(true);
  });

  it('toArray returns a copy', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    const arr = queue.toArray();
    expect(arr).toEqual([1, 2]);
    arr.push(3);
    expect(queue.size()).toBe(2);
  });
});
