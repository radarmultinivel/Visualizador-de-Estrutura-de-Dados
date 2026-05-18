// Desenvolvido por L. A. Leandro - São José dos Campos - SP - 18/05/2026
export class BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;

  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export interface BSTSearchStep {
  node: BSTNode;
  direction: 'root' | 'left' | 'right';
  found: boolean;
}

export class BST {
  root: BSTNode | null = null;

  insert(value: number): void {
    this.root = this._insert(this.root, value);
  }

  private _insert(node: BSTNode | null, value: number): BSTNode {
    if (node === null) return new BSTNode(value);
    if (value < node.value) {
      node.left = this._insert(node.left, value);
    } else if (value > node.value) {
      node.right = this._insert(node.right, value);
    }
    return node;
  }

  delete(value: number): void {
    this.root = this._delete(this.root, value);
  }

  private _delete(node: BSTNode | null, value: number): BSTNode | null {
    if (node === null) return null;
    if (value < node.value) {
      node.left = this._delete(node.left, value);
    } else if (value > node.value) {
      node.right = this._delete(node.right, value);
    } else {
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;
      const minNode = this._findMin(node.right);
      node.value = minNode.value;
      node.right = this._delete(node.right, minNode.value);
    }
    return node;
  }

  private _findMin(node: BSTNode): BSTNode {
    while (node.left !== null) node = node.left;
    return node;
  }

  search(value: number): BSTSearchStep[] {
    const steps: BSTSearchStep[] = [];
    let current = this.root;
    while (current !== null) {
      if (current.value === value) {
        steps.push({ node: current, direction: steps.length === 0 ? 'root' : steps[steps.length - 1].direction, found: true });
        return steps;
      }
      if (value < current.value) {
        steps.push({ node: current, direction: 'left', found: false });
        current = current.left;
      } else {
        steps.push({ node: current, direction: 'right', found: false });
        current = current.right;
      }
    }
    return steps;
  }

  inOrder(node: BSTNode | null = this.root, result: number[] = []): number[] {
    if (node !== null) {
      this.inOrder(node.left, result);
      result.push(node.value);
      this.inOrder(node.right, result);
    }
    return result;
  }

  clear(): void {
    this.root = null;
  }
}

export interface BSTLayoutNode {
  value: number;
  x: number;
  y: number;
  left: BSTLayoutNode | null;
  right: BSTLayoutNode | null;
}

export function computeBSTLayout(
  node: BSTNode | null,
  x: number,
  y: number,
  xOffset: number,
  yOffset: number
): BSTLayoutNode | null {
  if (node === null) return null;
  return {
    value: node.value,
    x,
    y,
    left: computeBSTLayout(node.left, x - xOffset, y + yOffset, xOffset / 2, yOffset),
    right: computeBSTLayout(node.right, x + xOffset, y + yOffset, xOffset / 2, yOffset),
  };
}
