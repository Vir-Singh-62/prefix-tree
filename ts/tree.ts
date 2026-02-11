class TreeNode {
    end: boolean;
    children: Map<string, TreeNode>;

    constructor() {
        this.end = false;
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
        currentNode.end = true;
    }

    remove(word: string): void {
        if (word.length === 0) {
            this.root.end = false;
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

        if (!currentNode.end) {
            return;
        }

        currentNode.end = false;

        // Prune nodes that are no longer needed (bottom-up)
        for (let i = stack.length - 1; i >= 0; i--) {
            const [parent, char] = stack[i];
            const child = parent.children.get(char)!;
            if (child.end || child.children.size > 0) {
                break;
            }
            parent.children.delete(char);
        }
    }

    has(word: string): boolean {
        let currentNode = this.root;
        for (const char of word) {
            if (!currentNode.children.has(char)) {
                return false;
            }
            currentNode = currentNode.children.get(char)!;
        }
        return currentNode.end;
    }

    complete(prefix: string): string[] {
        const results = this.dfs(this.root, prefix);
        return results;
    }

    private dfs (node: TreeNode, path: string, results: string[] = []): string[] {
        if (node.end) {
            results.push(path);
        }
        node.children.forEach((childNode, char) => {
            results.push(...this.dfs(childNode, path + char, results));
        });
        return results;
    }
}