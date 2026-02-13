class TreeNode
{
    public bool end { get; set; } = false;
    public Dictionary<char, TreeNode> Children { get; set; } = new();
}

class Tree
{
    private TreeNode root = new();

    public void insert(string word)
    {
        var current = this.root;
        foreach (var c in word)
        {
            if (!current.Children.ContainsKey(c))
            {
                current.Children[c] = new TreeNode();
            }
            current = current.Children[c];
        }
        current.end = true;
    }

    public void remove(string word)
    {
        if (word.Length == 0)
        {
            this.root.end = false;
            return;
        }

        var current = this.root;
        var stack = new List<(TreeNode parent, char ch)>();
        foreach (var c in word)
        {
            if (!current.Children.ContainsKey(c))
            {
                return;
            }
            stack.Add((current, c));
            current = current.Children[c];
        }

        if (!current.end)
        {
            return;
        }

        current.end = false;

        for (int i = stack.Count - 1; i >= 0; i--)
        {
            var (parent, ch) = stack[i];
            var child = parent.Children[ch];
            if (child.end || child.Children.Count > 0)
            {
                break;
            }
            parent.Children.Remove(ch);
        }
    }

    public bool search(string word)
    {
        var current = this.root;
        foreach (var c in word)
        {
            if (!current.Children.ContainsKey(c))
            {
                return false;
            }
            current = current.Children[c];
        }
        return current.end;
    }

    public List<string> complete(string prefix)
    {
        var current = this.root;
        foreach (var c in prefix)
        {
            if (!current.Children.ContainsKey(c))
            {
                return new List<string>();
            }
            current = current.Children[c];
        }

        return dfs(current, prefix);
    }

    private List<string> dfs(TreeNode node, string path, List<string>? result = null)
    {
        if (result == null) result = new List<string>();
        
        if (node.end)
        {
            result.Add(path);
        }

        foreach (var kvp in node.Children)
        {
            dfs(kvp.Value, path + kvp.Key, result);
        }
        
        return result;
    }
}