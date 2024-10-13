let editor;
let pyodide;

async function initPyodide() {
    try {
        pyodide = await loadPyodide();
        console.log("Pyodide loaded successfully");
    } catch (error) {
        console.error("Failed to load Pyodide:", error);
    }
}

// Call this function when the page loads
window.addEventListener('load', initPyodide);

function showEditor(lesson) {
    document.getElementById('editor-container').style.display = 'flex';
    if (!editor) {
        editor = ace.edit("editor");
        editor.setTheme("ace/theme/twilight");
        editor.session.setMode("ace/mode/python");
        editor.setOptions({
            fontSize: "18px"
        });
    }

    // Update the editor content based on the lesson chosen
    if (lesson === 'Hello World') {
        editor.setValue(`\
# Lesson: Hello World in Python
# The print() function is used to display output to the console.
print("Hello, World!")`, 1);
    } else if (lesson === 'Variables') {
        editor.setValue(`\
# Lesson: Variables in Python
# Variables are used to store data. 
x = 10  # This is an integer variable
name = "Alice"  # This is a string variable
print(x, name)`, 1);
    } else if (lesson === 'Conditionals') {
        editor.setValue(`\
# Lesson: Conditionals in Python
# Conditionals allow you to make decisions in your code.
x = 10
if x > 5:
    print("x is greater than 5")
else:
    print("x is not greater than 5")`, 1);
    } else if (lesson === 'Loops') {
        editor.setValue(`\
# Lesson: Loops in Python
# Loops allow you to repeat code multiple times.
for i in range(5):
    print(f"This is iteration {i+1}")`, 1);
    } else if (lesson === 'Functions') {
        editor.setValue(`\
# Lesson: Functions in Python
# Functions allow you to group code that performs a specific task.
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))`, 1);
    } else if (lesson === 'Sets') {  // New lesson added here
        editor.setValue(`\
# Lesson: Sets in Python
# Sets are collections of unique elements.
my_set = {1, 2, 3, 4, 5}
print("Original set:", my_set)

# Adding an element
my_set.add(6)
print("After adding 6:", my_set)

# Removing an element
my_set.remove(3)
print("After removing 3:", my_set)

# Checking if an element exists
if 2 in my_set:
    print("2 is in the set")

# Set operations
another_set = {4, 5, 6, 7}
union_set = my_set.union(another_set)
print("Union of sets:", union_set)

intersection_set = my_set.intersection(another_set)
print("Intersection of sets:", intersection_set)`, 1);
    }
    else if (lesson === 'Dictionary') {
    editor.setValue(`\
# Lesson: Dictionaries in Python
# Dictionaries store key-value pairs.
# Keys must be unique and can be of different data types.
            
# Creating a dictionary
student = {
    "name": "Alice",
    "age": 22,
    "major": "Computer Science"
}
            
# Accessing dictionary values using keys
print("Student's name:", student["name"])
print("Student's age:", student["age"])
            
# Adding a new key-value pair
student["grade"] = "A"
print("Updated student dictionary:", student)
            
# Modifying an existing value
student["age"] = 23
print("After modifying age:", student)
            
# Removing a key-value pair
del student["major"]
print("After removing major:", student)
            
# Looping through dictionary keys and values
for key, value in student.items():
    print(f"{key}: {value}")
            
# Checking if a key exists
if "name" in student:
    print("The student's name is:", student["name"])
            
# Using the get() method to access values safely
major = student.get("major", "No major specified")
print("Student's major:", major)`, 1);
    }
}

async function runCode() {
    // Clear the terminal
    clearTerminal();

    // Get the code from the editor
    const code = editor.getValue();
    const terminal = document.getElementById('terminal');

    // Run the code using Pyodide
    try {
        await pyodide.runPythonAsync(`\
import sys
from io import StringIO

# Create a buffer to capture stdout
output_buffer = StringIO()
sys.stdout = output_buffer

try:
    # Run the user code
    ${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    print(f"Error: {e}")

# Reset stdout and get the output
sys.stdout = sys.__stdout__
output = output_buffer.getvalue()
output
        `).then(output => {
            terminal.innerHTML += output;
        });
    } catch (err) {
        terminal.innerHTML += `Error:\n${err}\n`;
    }
}

function clearTerminal() {
    document.getElementById('terminal').innerHTML = '';
}

// Theme toggle function
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    updateThemeIcon();
});

function updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = themeToggle.querySelector('.fa-sun');
    const moonIcon = themeToggle.querySelector('.fa-moon');

    if (document.body.classList.contains('dark-theme')) {
        themeToggle.title = 'Switch to light theme';
        sunIcon.style.display = 'inline-block';
        moonIcon.style.display = 'none';
    } else {
        themeToggle.title = 'Switch to dark theme';
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline-block';
    }
}


// Challenge color

// script.js
document.querySelectorAll('#challenge-list a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default behavior

        // Remove the 'clicked' class from all links
        document.querySelectorAll('#challenge-list a').forEach(link => link.classList.remove('clicked'));

        // Add the 'clicked' class to the clicked link
        this.classList.add('clicked');
    });
});

function viewChallenge(challenge) {
    console.log("View Challenge:", challenge);
    // Additional logic for viewing the challenge can go here
}

// Initial theme setting
document.addEventListener('DOMContentLoaded', () => {
    updateThemeIcon();
});

// For the challenge page

function viewChallenge(challengeName) {
    const description = document.getElementById('challenge-description');

    switch (challengeName) {
        case 'Basic Math Challenge':
            description.innerHTML = `\
                <h4>Basic Math Challenge</h4>
                <p>Test your skills in basic arithmetic operations. Solve the problems below:</p>
                <ul>
                    <li>What is 5 + 7?</li>
                    <li>What is 12 - 4?</li>
                    <li>What is 3 * 8?</li>
                    <li>What is 16 / 4?</li>
                </ul>
            `;
            break;
        case 'Logic Challenge':
            description.innerHTML = `\
                <h4>Logic Challenge</h4>
                <p>Use your logical thinking to solve these puzzles:</p>
                <ul>
                    <li>If two's company, and three's a crowd, what are four and five?</li>
                    <li>What has keys but can't open locks?</li>
                </ul>
            `;
            break;
        case 'String Manipulation':
            description.innerHTML = `
                <h4>String Manipulation Challenge</h4>
                <p>Put your string handling skills to the test! This challenge will assess your ability to manipulate and transform strings using various operations:</p>
                <ul>
                    <li>Reverse a given string and provide the result</li>
                    <li>Check if a string is a palindrome.</li>
                    <li>Convert the entire string to uppercase or lowercase.</li>
                </ul>
            `;
            break;
        case 'File Handling Challenge':
            description.innerHTML = `
                <h4>File Handling Challenge</h4>
                <p>Put your file handling skills to the test! This challenge will assess your ability to read from and write to files, as well as manipulate their contents.:</p>
                <ul>
                    <li>Count the number of lines in a given text file.</li>
                    <li>Search for a specific word in a file and display the line numbers where it appears</li>
                    <li>Create a new file and write a list of strings into it, each on a new line.</li>
                </ul>
            `;
            break;
        case 'Data Structures Challenge':
            description.innerHTML = `\
                <h4>Data Structures Challenge</h4>
                <p>Apply your knowledge of data structures in these coding problems:</p>
                <ul>
                    <li>Implement a stack using an array.</li>
                    <li>Write a function to reverse a linked list.</li>
                </ul>
            `;
            break;
        case 'Dynamic Pogramming Challenge':
            description.innerHTML = `
                <h4>Dynamic Programming Challenge</h4>
<p>Put your dynamic programming skills to the test!. Tackle the tasks below:</p>
<ul>
    <li>Implement a function to calculate the nth Fibonacci number using dynamic programming.</li>
    <li>Solve the Knapsack problem: given a set of items, determine the maximum value that can be carried in a knapsack of a given capacity.</li>
    <li>Write a function to find the length of the longest common subsequence between two strings.</li>
    
    
</ul>

            `;
            break;
        case 'Object-Oriented Programming':
            description.innerHTML = `
              <h4>Object-Oriented Programming Challenge</h4>
<p>Test your object-oriented programming skills! This challenge will evaluate your ability to design and implement classes and objects. Take on the tasks below:</p>
<ul>
    <li>Design a bank account class with methods for deposit, withdrawal, and balance inquiry.</li>
    <li>Create a class hierarchy for vehicles (Car, Truck, Motorcycle) inheriting from a base Vehicle class.</li>
    <li>Implement a library management system with classes for books, patrons, and loans.</li>
    
</ul>
            `;
            break;
        case 'Recursion':
            description.innerHTML = `
              <h4>Recursion Challenge</h4>
                    <p>Challenge yourself with recursion! Take on the tasks below:</p>
                    <ul>
                      <li>Write a recursive function to calculate the factorial.</li>
                      <li>Generate Fibonacci numbers recursively.</li>
                      <li>Reverse a string using recursion.</li>
                      <li>Solve the Tower of Hanoi problem recursively.</li>
                      <li>Find the greatest common divisor (GCD) using recursion.</li>
                    </ul>

            `;
            break;
        case 'Search Algorithm':
            description.innerHTML = `
              <h4>Search Algorithm Challenge</h4>
                <p>Test your search algorithm skills! Solve the tasks below:</p>
                <ul>
                    <li>Implement linear search to find an element in an unsorted list.</li>
                    <li>Write a binary search function for a sorted list.</li>
                    <li>Develop a function for depth-first search (DFS) on a graph.</li>
                    <li>Implement breadth-first search (BFS) for a tree.</li>
                    <li>Count occurrences of a specific element in a list.</li>
                </ul>


            `;
            break;
        case 'Array':
            description.innerHTML = `
              <h4>Array Challenge</h4>
<p>Put your array skills to the test! Complete the tasks below:</p>
<ul>
    <li>Write a function to find the maximum and minimum elements in an array.</li>
    <li>Implement a function to rotate an array by a given number of positions.</li>
    <li>Merge two sorted arrays into one sorted array.</li>
    <li>Find the second largest element in an array.</li>
    <li>Remove duplicates from an array while maintaining order.</li>
</ul>


            `;
            break;
        case 'Graph':
            description.innerHTML = `
              <h4>Graph Algorithms Challenge</h4>
              <p>Test your graph algorithm skills! This challenge will assess your ability to traverse graphs and find shortest paths. Solve the tasks below:</p>
              <ul>
                  <li>Implement Depth-First Search (DFS) from a starting vertex.</li>
                  <li>Implement Breadth-First Search (BFS) to visit all vertices.</li>
                  <li>Apply Dijkstra's algorithm for the shortest path in a weighted graph.</li>
                  <li>Add edges for both directed and undirected graphs.</li>
                  <li>Represent the graph using adjacency lists.</li>
              </ul>



            `;
            break;
        default:
            description.innerHTML = `<p>Select a challenge to view its description.</p>`;
    }
}
