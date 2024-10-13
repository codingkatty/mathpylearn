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
        editor.setValue(`
# Lesson: Hello World in Python
# The print() function is used to display output to the console.
print("Hello, World!")`, 1); // 1 to move cursor to the end
    } else if (lesson === 'Variables') {
        editor.setValue(`
# Lesson: Variables in Python
# Variables are used to store data. 
x = 10  # This is an integer variable
name = "Alice"  # This is a string variable
print(x, name)`, 1); // 1 to move cursor to the end
    } else if (lesson === 'Conditionals') {
        editor.setValue(`
# Lesson: Conditionals in Python
# Conditionals allow you to make decisions in your code.
x = 10
if x > 5:
    print("x is greater than 5")
else:
    print("x is not greater than 5")`, 1);
    } else if (lesson === 'Loops') {
        editor.setValue(`
# Lesson: Loops in Python
# Loops allow you to repeat code multiple times.
for i in range(5):
    print(f"This is iteration {i+1}")`, 1);
    } else if (lesson === 'Functions') {
        editor.setValue(`
# Lesson: Functions in Python
# Functions allow you to group code that performs a specific task.
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))`, 1);
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
        await pyodide.runPythonAsync(`
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
            // console.log(output);
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

// Initial theme setting
document.addEventListener('DOMContentLoaded', () => {
    updateThemeIcon();
});

// For the challenge page

function viewChallenge(challengeName) {
    const description = document.getElementById('challenge-description');
    
    switch (challengeName) {
        case 'Basic Math Challenge':
            description.innerHTML = `
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
            description.innerHTML = `
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
            description.innerHTML = `
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
<p>Are you ready to take on the challenge? Let’s see how well you can apply dynamic programming to solve these problems!</p>

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
        default:
            description.innerHTML = `<p>Select a challenge to view its description.</p>`;
    }
}