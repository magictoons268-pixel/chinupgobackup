class StudentNode:
    def __init__(self, roll_no, name, marks):
        self.roll_no = roll_no
        self.name = name
        self.marks = marks
        self.next = None


class StudentLinkedList:
    def __init__(self):
        self.head = None

    # Add a student
    def add_student(self, roll_no, name, marks):
        new_node = StudentNode(roll_no, name, marks)

        if self.head is None:
            self.head = new_node
        else:
            current = self.head

            while current.next:
                current = current.next

            current.next = new_node

        print("Student record added.")

    # Delete a student
    def delete_student(self, roll_no):
        current = self.head
        prev = None

        while current:
            if current.roll_no == roll_no:
                if prev:
                    prev.next = current.next
                else:
                    self.head = current.next

                print("Student record deleted.")
                return

            prev = current
            current = current.next

        print("Student not found.")

    # Update a student
    def update_student(self, roll_no, new_name, new_marks):
        current = self.head

        while current:
            if current.roll_no == roll_no:
                current.name = new_name
                current.marks = new_marks
                print("Student record updated.")
                return

            current = current.next

        print("Student not found.")

    # Search for a student
    def search_student(self, roll_no):
        current = self.head

        while current:
            if current.roll_no == roll_no:
                print(
                    f"Found: Roll No: {current.roll_no}, "
                    f"Name: {current.name}, Marks: {current.marks}"
                )
                return

            current = current.next

        print("Student not found.")

    # Display students with sorting
    def display_students(self, sort_by="roll_no", ascending=True):
        students = []
        current = self.head

        while current:
            students.append(
                (current.roll_no, current.name, current.marks)
            )
            current = current.next

        if sort_by == "roll_no":
            students.sort(key=lambda x: x[0], reverse=not ascending)
        elif sort_by == "marks":
            students.sort(key=lambda x: x[2], reverse=not ascending)

        if not students:
            print("No records to display.")
            return

        print("\nStudent Records:")

        for s in students:
            print(f"Roll No: {s[0]}, Name: {s[1]}, Marks: {s[2]}")


# Menu for interaction
def menu():
    system = StudentLinkedList()

    while True:
        print("\n--- Student Record Management Menu ---")
        print("1. Add Student")
        print("2. Delete Student")
        print("3. Update Student")
        print("4. Search Student")
        print("5. Display All Students")
        print("6. Exit")

        choice = input("Enter your choice (1-6): ")

        if choice == '1':
            roll = int(input("Enter Roll No: "))
            name = input("Enter Name: ")
            marks = int(input("Enter Marks: "))
            system.add_student(roll, name, marks)

        elif choice == '2':
            roll = int(input("Enter Roll No to Delete: "))
            system.delete_student(roll)

        elif choice == '3':
            roll = int(input("Enter Roll No to Update: "))
            name = input("Enter New Name: ")
            marks = int(input("Enter New Marks: "))
            system.update_student(roll, name, marks)

        elif choice == '4':
            roll = int(input("Enter Roll No to Search: "))
            system.search_student(roll)

        elif choice == '5':
            sort_key = input(
                "Sort by 'roll_no' or 'marks': "
            ).strip()

            order = input("Order 'asc' or 'desc': ").strip()
            ascending = True if order == 'asc' else False

            system.display_students(
                sort_by=sort_key,
                ascending=ascending
            )

        elif choice == '6':
            print("Exiting Student Record Management System.")
            break

        else:
            print("Invalid choice. Try again.")


# Start the system
menu()