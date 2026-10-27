class LinearProbingHashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [None] * size
        self.DELETED = "<DELETED>"

    def _hash_function(self, key):
        return key % self.size

    def insert(self, key):
        index = self._hash_function(key)
        original_index = index

        while self.table[index] not in (None, self.DELETED):
            if self.table[index] == key:
                print(f"Key {key} already exists at index {index}.")
                return

            index = (index + 1) % self.size

            if index == original_index:
                print("Hash table is full. Cannot insert.")
                return

        self.table[index] = key
        print(f"Inserted key {key} at index {index}.")

    def search(self, key):
        index = self._hash_function(key)
        original_index = index

        while self.table[index] is not None:
            if self.table[index] == key:
                print(f"Key {key} found at index {index}.")
                return index

            index = (index + 1) % self.size

            if index == original_index:
                break

        print(f"Key {key} not found.")
        return None

    def delete(self, key):
        index = self.search(key)

        if index is not None:
            self.table[index] = self.DELETED
            print(f"Key {key} deleted from index {index}.")

    def display(self):
        print("Hash Table:")

        for i, key in enumerate(self.table):
            print(f"Index {i}: {key}")


# Create a hash table
ht = LinearProbingHashTable()

# Insert keys
ht.insert(10)
ht.insert(20)
ht.insert(30)  # Should go to different slots
ht.insert(20)  # Duplicate

# Display the hash table
ht.display()

# Search for keys
ht.search(20)
ht.search(99)

# Delete a key and search again
ht.delete(20)
ht.search(20)

# Display the updated hash table
ht.display()
