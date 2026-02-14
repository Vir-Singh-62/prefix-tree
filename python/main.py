from typing import Tuple


class TrieNode:
    def __init__(self) -> None:
        self.isEndOfWord: bool = False
        self.children: dict[str, "TrieNode"] = {}

class Trie:
    root: TrieNode

    def __init__(self) -> None:
        self.root = TrieNode()

    def insert(self, word: str) -> None : 
        node = self.root
        for char in word :
            if char not in node.children :
                node.children[char] = TrieNode()
            
            node = node.children[char]
        node.isEndOfWord = True

    def remove(self, word: str) -> None : 
        node = self.root
        
        stack: list[Tuple[TrieNode, str]] = []

        for char in word :
            if char not in node.children :
                return
            
            stack.append((node, char))
            node = node.children[char]
        

        if not node.isEndOfWord : return

        node.isEndOfWord = False

        for (parent, char) in reversed(stack):
            child = parent.children[char]

            if child.children or child.isEndOfWord:
                break
            
            del parent.children[char]


    def search(self, word: str) -> bool : 
        node = self.root
        for char in word :
            if char not in node.children :
                return False
            
            node = node.children[char]
        return node.isEndOfWord 

    def complete(self, prefix: str) -> list[str] : 
        node = self.root
        for char in prefix:
            if char not in node.children :
                return[]
            node = node.children[char]
            
        return self.dfs(self.root, prefix)
    
    @staticmethod
    def dfs(node: TrieNode, prefix: str) -> list[str] : 
        result:list = []
        
        if node.isEndOfWord :
            result.append(prefix)
        
        for ch, child in node.children.items():
            result.extend(Trie.dfs(child, prefix+ch))

        return result

