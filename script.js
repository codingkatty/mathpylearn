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
        default:
            description.innerHTML = `<p>Select a challenge to view its description.</p>`;
    }
}