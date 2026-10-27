
class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


class BST:
    def __init__(self):
        self.root = None

    # Insert a new key
    def insert(self, root, key):
        if root is None:
            return Node(key)
        if key < root.key:
            root.left = self.insert(root.left, key)
        elif key > root.key:
            root.right = self.insert(root.right, key)
        return root

    # Search for a key
    def search(self, root, key):
        if root is None:
            return None
        if key == root.key:
            return root
        elif key < root.key:
            return self.search(root.left, key)
        else:
            return self.search(root.right, key)

    # Find the node with minimum key (used in deletion)
    def min_value_node(self, node):
        current = node
        while current.left is not None:
            current = current.left
        return current

    # Delete a node
    def delete(self, root, key):
        if root is None:
            return root
        if key < root.key:
            root.left = self.delete(root.left, key)
        elif key > root.key:
            root.right = self.delete(root.right, key)
        else:
            # Node with only one child or no child
            if root.left is None:
                return root.right
            elif root.right is None:
                return root.left

            # Node with two children: get inorder successor
            temp = self.min_value_node(root.right)
            root.key = temp.key
            root.right = self.delete(root.right, temp.key)

        return root

    # Traversal methods
    def inorder(self, root):
        if root:
            self.inorder(root.left)
            print(root.key, end=" ")
            self.inorder(root.right)

    def preorder(self, root):
        if root:
            print(root.key, end=" ")
            self.preorder(root.left)
            self.preorder(root.right)

    def postorder(self, root):
        if root:
            self.postorder(root.left)
            self.postorder(root.right)
            print(root.key, end=" ")


# ---- Driver Code ----
if __name__ == "__main__":
    bst = BST()
    root = None

    # Insert elements
    nums = [50, 30, 70, 20, 40, 60, 80]
    for num in nums:
        root = bst.insert(root, num)

    print("Inorder traversal: ", end="")
    bst.inorder(root)
    print("\nPreorder traversal: ", end="")
    bst.preorder(root)
    print("\nPostorder traversal: ", end="")
    bst.postorder(root)

    # Search operation
    key = 40
    if bst.search(root, key):
        print(f"\n\nKey {key} found in BST.")
    else:
        print(f"\n\nKey {key} not found in BST.")

    # Delete a node
    root = bst.delete(root, 70)
    print("\nInorder after deleting 70: ", end="")
    bst.inorder(root)
