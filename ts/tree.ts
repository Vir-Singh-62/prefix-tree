class TreeNode {
  isEndOfWord: boolean;
  children: Map<string, TreeNode>;

  constructor() {
    this.isEndOfWord = false;
    this.children = new Map();
  }
}

class PrefixTree {
  private root: TreeNode;

  constructor() {
    this.root = new TreeNode();
  }

  insert(word: string): void {
    let currentNode = this.root;
    for (const char of word) {
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new TreeNode());
      }
      currentNode = currentNode.children.get(char)!;
    }
    currentNode.isEndOfWord = true;
  }

  remove(word: string): void {
    if (word.length === 0) {
      this.root.isEndOfWord = false;
      return;
    }

    let currentNode = this.root;
    const stack: Array<[TreeNode, string]> = [];

    for (const char of word) {
      if (!currentNode.children.has(char)) {
        return;
      }
      stack.push([currentNode, char]);
      currentNode = currentNode.children.get(char)!;
    }

    if (!currentNode.isEndOfWord) {
      return;
    }

    currentNode.isEndOfWord = false;

    // Prune nodes that are no longer needed (bottom-up)
    for (let i = stack.length - 1; i >= 0; i--) {
      const [parent, char] = stack[i];
      const child = parent.children.get(char)!;
      if (child.isEndOfWord || child.children.size > 0) {
        break;
      }
      parent.children.delete(char);
    }
  }

  search(word: string): boolean {
    let currentNode = this.root;
    for (const char of word) {
      if (!currentNode.children.has(char)) {
        return false;
      }
      currentNode = currentNode.children.get(char)!;
    }
    return currentNode.isEndOfWord;
  }

  complete(prefix: string): string[] {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) return [];
      node = node.children.get(char)!;
    }

    return this.dfs(node, prefix);
  }

  private dfs(node: TreeNode, prefix: string): string[] {
    const results: Array<string> = [];

    if (node.isEndOfWord) {
      results.push(prefix);
    }
    node.children.forEach((childNode, char) => {
      results.push(...this.dfs(childNode, prefix + char));
    });

    return results;
  }
}
