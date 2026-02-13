import java.util.*;

final class Trie {
    private final TrieNode root = new TrieNode();

    private static class TrieNode {
        public final Map<Character, TrieNode> children = new HashMap<>();
        public boolean isEndOfWord = false;
    }
    

    public void insert(String word) {
        TrieNode node = this.root;
        for (char c : word.toCharArray()) {
            if (!node.children.containsKey(c)) {
                node.children.put(c, new TrieNode());
            }
            node = node.children.get(c);
        }
        node.isEndOfWord = true;
    }

    public boolean remove(String word) {
        return removeHelper(root, word, 0);
    }

    private boolean removeHelper(TrieNode node, String word, int index) {
        if (index == word.length()) {
            if (!node.isEndOfWord) {
                return false;
            }
            node.isEndOfWord = false;
            return node.children.isEmpty();
        }

        char c = word.charAt(index);
        TrieNode child = node.children.get(c);
        if (child == null) {
            return false;
        }

        boolean shouldDeleteChild = removeHelper(child, word, index + 1);

        if (shouldDeleteChild) {
            node.children.remove(c);
            return !node.isEndOfWord && node.children.isEmpty();
        }

        return false;
    }

    public boolean search(String word) {
        TrieNode node = this.root;
        for (char c : word.toCharArray()) {
            if (!node.children.containsKey(c)) {
                return false;
            }
            node = node.children.get(c);
        }
        return node.isEndOfWord;
    }

    public List<String> complete(String prefix) {
        TrieNode node = this.root;
        for (char c : prefix.toCharArray()) {
            if (!node.children.containsKey(c)) {
                return new ArrayList<>();
            }
            node = node.children.get(c);
        }
        return dfs(node, prefix, new ArrayList<>());
    }

    private List<String> dfs(TrieNode node, String prefix, List<String> result) {
        if (node.isEndOfWord) {
            result.add(prefix);
        }
        
        for (Map.Entry<Character, TrieNode> entry : node.children.entrySet()) {
            dfs(entry.getValue(), prefix + entry.getKey(), result);
        }
        
        return result;
    }
    
}
