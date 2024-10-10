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
initPyodide();

function showEditor(lesson) {
    document.getElementById('editor-container').style.display = 'flex';
    if (!editor) {
        editor = ace.edit("editor");
        editor.setTheme("ace/theme/twilight");
        editor.session.setMode("ace/mode/python");
        editor.setOptions({
            fontSize: "18px"  // Increased from 16px
        });
    }
    editor.setValue(`# ${lesson} lesson\n# Start coding here`);
}

async function runCode() {
    const terminal = document.getElementById('terminal');
    terminal.innerHTML += '> Running code...<br>';  // Use <br> instead of \n

    if (!pyodide) {
        terminal.innerHTML += 'Error: Pyodide is not loaded. Please refresh the page and try again.<br>';
        return;
    }

    const code = editor.getValue();

    try {
        // Redirect stdout to capture print statements
        pyodide.runPython(`
            import sys
            import io
            sys.stdout = io.StringIO()
        `);

        // Run the user's code
        await pyodide.runPythonAsync(code);

        // Get the captured output
        const output = pyodide.runPython("sys.stdout.getvalue()");

        // Use <br> to replace newlines in the output
        terminal.innerHTML += output.replace(/\n/g, '<br>');

        // Reset stdout
        pyodide.runPython("sys.stdout = sys.__stdout__");
    } catch (error) {
        terminal.innerHTML += `Error: ${error.message}<br>`;
    }

    terminal.innerHTML += '> Code execution completed.<br><br>';
    terminal.scrollTop = terminal.scrollHeight;
}

// Function to clear the terminal
function clearTerminal() {
    const terminal = document.getElementById('terminal');
    terminal.innerHTML = '';  // Clear the terminal output
}

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

// Ensure the active link in the navbar reflects the current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = document.body.id;
    const activeLink = document.querySelector(`.navbar a[href="${currentPage}.html"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
});