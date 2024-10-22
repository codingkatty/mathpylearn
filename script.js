let editor;
let pyodide;
let currentLesson;
let currentContentType;

// Add these lines at the beginning of the file
let userProgress = JSON.parse(localStorage.getItem('userProgress')) || {
    lessons: {},
    challenges: {}
};

function updateProgress(type, item) {
    if (type === 'lesson') {
        userProgress.lessons[item] = true;
    } else if (type === 'challenge') {
        userProgress.challenges[item] = true;
    }
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
    updateProgressBar();
}

function updateProgressBar() {
    const lessonProgress = document.getElementById('lesson-progress');
    const challengeProgress = document.getElementById('challenge-progress');
    const lessonResetBtn = document.getElementById('lesson-reset-btn');
    const challengeResetBtn = document.getElementById('challenge-reset-btn');

    if (lessonProgress) {
        const completedLessons = Object.values(userProgress.lessons).filter(Boolean).length;
        const totalLessons = document.querySelectorAll('.lesson-list li').length;
        const lessonPercentage = (completedLessons / totalLessons) * 100;
        lessonProgress.style.width = `${lessonPercentage}%`;
        lessonProgress.textContent = `${Math.round(lessonPercentage)}%`;

        // Show reset button if there's any progress
        if (lessonResetBtn) {
            lessonResetBtn.style.display = completedLessons > 0 ? 'inline-block' : 'none';
        }
    }

    if (challengeProgress) {
        const completedChallenges = Object.values(userProgress.challenges).filter(Boolean).length;
        const totalChallenges = document.querySelectorAll('#challenge-list li').length;
        const challengePercentage = (completedChallenges / totalChallenges) * 100;
        challengeProgress.style.width = `${challengePercentage}%`;
        challengeProgress.textContent = `${Math.round(challengePercentage)}%`;

        // Show reset button if there's any progress
        if (challengeResetBtn) {
            challengeResetBtn.style.display = completedChallenges > 0 ? 'inline-block' : 'none';
        }
    }
}

// Add this function to your script.js file
function resetProgress(type) {
    if (type === 'lesson') {
        userProgress.lessons = {};
    } else if (type === 'challenge') {
        userProgress.challenges = {};
    }
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
    updateProgressBar();
}

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
    currentLesson = lesson;
    currentContentType = 'lesson';  // Set the content type to 'lesson'
    document.getElementById('editor-container').style.display = 'flex';
    if (!editor) {
        editor = ace.edit("editor");
        editor.setTheme("ace/theme/twilight");
        editor.session.setMode("ace/mode/python");
        editor.setOptions({
            fontSize: "18px"
        });

        // Enable basic autocompletion
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true
        });

        // Define custom keywords for auto-completion
        const customKeywords = ['import', 'from', 'class', 'def', 'return', 'for', 'while', 'if', 'elif', 'else',
            'try', 'except', 'finally', 'with', 'as', 'lambda', 'print', 'input', 'len',
            'str', 'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple', 'open', 'range'];
        const customCompleter = {
            getCompletions: function (editor, session, pos, prefix, callback) {
                if (prefix.length === 0) { return callback(null, []); }
                const completions = customKeywords.map(function (keyword) {
                    return {
                        caption: keyword,
                        value: keyword,
                        meta: "keyword"
                    };
                });
                callback(null, completions);
            }
        };

        // Add the custom completer to ACE's completers
        ace.require("ace/ext/language_tools").addCompleter(customCompleter);

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
    else if (lesson === 'Lists') {
        editor.setValue(`\
# 1. Creating a list with integers
my_list = [1, 2, 3, 4, 5]

# Creating a list with mixed data types
mixed_list = [1, "hello", 3.14, True]

# Creating an empty list
empty_list = []

# 2. Accessing the first element
first_element = my_list[0]
print("First Element", first_element)  # Output: 1

# Accessing the last element
last_element = my_list[-1]
print("Last Element", last_element)  # Output: 5

# 3. Lists are mutable, so you can change the value of elements.
# Modifying the second element
my_list[1] = 20
print("After modifying the second element:", my_list)  # Output: [1, 20, 3, 4, 5]

# 4. Basic Operations
# 4.1 Appending an element
my_list.append(100)
print("Appending 100:", my_list)  # Output: [1, 20, 3, 4, 5, 100]

# 4.2 Inserting an element at a specific position
my_list.insert(1, 6)
print("Inserting 6 at position 1:", my_list)  # Output: [1, 6, 20, 3, 4, 5, 100]

# 4.3 Removing a specific element by value
my_list.remove(3)
print("Removing 3:", my_list)  # Output: [1, 6, 20, 4, 5, 100]

# 4.4 Removing an element by index
my_list.pop(1)
print("Removing element at index 1:", my_list)  # Output: [1, 20, 4, 5, 100]

# 4.5 Removing the last element
my_list.pop()
print("Removing the last element:", my_list)  # Output: [1, 20, 4, 5]`, 1);
    }
    else if (lesson === 'Tuples') {
        editor.setValue(`\
# 1. Creating Tuples
# Creating a tuple with integers
my_tuple = (1, 2, 3, 4, 5)

# Creating a tuple with mixed data types
mixed_tuple = (1, "hello", 3.14, True)

# Creating a tuple with a single item (note the comma)
single_item_tuple = (10,)

# Creating an empty tuple
empty_tuple = ()

# 2. Accessing elements
my_tuple = (10, 20, 30, 40, 50)

# Accessing the first element
first_element = my_tuple[0]
print("First Element:", first_element)  # Output: 10

# Accessing the last element
last_element = my_tuple[-1]
print("Last Element:", last_element)  # Output: 50

# 3. Tuples are immutable
my_tuple = (1, 2, 3)

# Trying to modify an element (this will raise an error)
# my_tuple[1] = 100  # Uncommenting this line will cause a TypeError


# 4. Basic Operations
# 4.1 Concatenating two tuples
tuple1 = (1, 2, 3)
tuple2 = (4, 5, 6)
result_tuple = tuple1 + tuple2
print("Concatenation of tuple1 and tuple2:", result_tuple)  # Output: (1, 2, 3, 4, 5, 6)

# 4.2 Repeating the tuple
my_tuple = (1, 2, 3)
repeated_tuple = my_tuple * 3
print("Repeated Tuple", repeated_tuple)  # Output: (1, 2, 3, 1, 2, 3, 1, 2, 3)

# 4.3 Slicing
# Slicing the first 3 elements
my_tuple = (10, 20, 30, 40, 50, 60)
print("Slicing", my_tuple[:3])  # Output: (10, 20, 30)

# Slicing from the third element to the end
print(my_tuple[2:])  # Output: (30, 40, 50, 60)

# Slicing a range of elements
print(my_tuple[1:4])  # Output: (20, 30, 40)

# 4.4 Unpacking the tuple
my_tuple = (10, 20, 30)
a, b, c = my_tuple
print("Unpacking", a)  # Output: 10
print(b)  # Output: 20
print(c)  # Output: 30`, 1);
    }
    else if (lesson === "TryExcept") {
        editor.setValue(`\
# Example 1
try:
    result = 10 / 0     # Risky code
except ZeroDivisionError:
    print("Cannot divide by zero!") # Handling the exception
    
# Example 2
try:
    age = 17
    if age < 18:
        raise ValueError("You must be at least 18 years old.")
except ValueError as e:
    print(e)`, 1);
    }
    updateProgress('lesson', lesson);
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

    if (getTheme() === 'dark') {
        themeToggle.title = 'Switch to light theme';
        sunIcon.style.display = 'inline-block';
        moonIcon.style.display = 'none';
    } else {
        themeToggle.title = 'Switch to dark theme';
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline-block';
    }
}

// Add these functions at the beginning of your script.js file

function setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.body.classList.toggle('dark-theme', theme === 'dark');
    updateThemeIcon();
}

function getTheme() {
    return localStorage.getItem('theme') || 'light';
}

// Modify the existing theme toggle event listener
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = getTheme() === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    // Apply the stored theme when the page loads
    setTheme(getTheme());
});

// Challenge color

// script.js
document.querySelectorAll('#challenge-list a').forEach(link => {
    link.addEventListener('click', function (e) {
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
    updateProgress('challenge', challenge);
}

// Initial theme setting
document.addEventListener('DOMContentLoaded', () => {
    updateThemeIcon();
});

// genrate random quetions

const questions = [
    "Write a Python function to find the factorial of a number.",
    "Write a Python program to check if a string is a palindrome.",
    "Write a Python function to calculate the sum of numbers in a list.",
    "Write a Python program to print the Fibonacci sequence.",
    "Write a Python function to sort a list of numbers."
    // Add more questions as needed
];
function generateQuestion() {
    currentContentType = 'practice_question';
    const randomIndex = Math.floor(Math.random() * questions.length);
    currentContent = questions[randomIndex]; // Store the current question text
    document.getElementById('random-question').innerText = currentContent;
    if (editor) {
        editor.setValue(`# Question: ${currentContent}\n\n# Write your Python code here:\n`, 1);
    }
}

// Call this function on page load if you want to display a question initially
// generateQuestion();


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
    updateProgress('challenge', challengeName);
}

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function () {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
    updateProgressBar();
});


document.addEventListener("DOMContentLoaded", () => {
    const lessonResetBtn = document.getElementById('lesson-reset-btn');
    const challengeResetBtn = document.getElementById('challenge-reset-btn');

    if (lessonResetBtn) {
        lessonResetBtn.addEventListener('click', () => resetProgress('lesson'));
    }

    if (challengeResetBtn) {
        challengeResetBtn.addEventListener('click', () => resetProgress('challenge'));
    }

    updateProgressBar();
});

function checkWindowSize() {
    const navLinks = document.querySelector('.nav-links');
    const icon = document.querySelector('.icon');

    if (window.innerWidth > 992) {
        navLinks.style.display = 'flex';
        icon.style.display = 'none';
    } else {
        navLinks.style.display = 'none';
        icon.style.display = 'block';
    }
}

window.addEventListener('resize', checkWindowSize);
// window.addEventListener('load', checkWindowSize);

function openMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector(".fa-bars");
    const closeIcon = document.querySelector(".fa-times");

    if (navLinks.style.display === "flex") {
        navLinks.style.display = "none";
        menuIcon.style.display = 'inline-block';
        closeIcon.style.display = 'none';
    } else {
        navLinks.style.display = "flex";
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'inline-block';
    }
}

//This function should check currentContentType to decide how to reset the editor.
function resetEditor() {
    // Check the type of content currently loaded
    if (currentContentType === 'lesson') {
        // If it's a lesson, reset to the original lesson content
        showEditor(currentLesson);
    } else if (currentContentType === 'practice_question') {
        // If it's a practice question, clear the editor but keep the question visible
        if (editor && currentContent) {
            editor.setValue(`# Question: ${currentContent}\n\n# Write your Python code here:\n`, 1);
        }
    }
}

//reset-button
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('reset-code').addEventListener('click', resetEditor);
});


document.getElementById('copy-code').addEventListener('click', () => {
    const code = editor.getValue();
    navigator.clipboard.writeText(code)
        .then(() => {
            const copyMessage = document.getElementById('copy-message');
            copyMessage.style.display = 'block';
            setTimeout(() => {
                copyMessage.style.display = 'none';
            }, 1000);
        })
        .catch(err => {
            console.error("Failed to copy text: ", err);
        });
});

