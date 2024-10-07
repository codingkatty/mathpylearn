let editor;
let pyodide;

async function initPyodide() {
    pyodide = await loadPyodide();
    console.log("Pyodide loaded");
}

// Call this function when the page loads
initPyodide();

function showEditor(lesson) {
    document.getElementById('editor-container').style.display = 'flex';
    if (!editor) {
        editor = ace.edit("editor");
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/python");
    }
    editor.setValue(`# ${lesson} lesson\n# Start coding here`);
}

async function runCode() {
    if (!pyodide) {
        console.error("Pyodide is not loaded yet");
        return;
    }

    const code = editor.getValue();
    const terminal = document.getElementById('terminal');
    terminal.innerHTML += '> Running code...\n';

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
        terminal.innerHTML += output;

        // Reset stdout
        pyodide.runPython("sys.stdout = sys.__stdout__");
    } catch (error) {
        terminal.innerHTML += `Error: ${error.message}\n`;
    }

    terminal.innerHTML += '> Code execution completed.\n\n';
    terminal.scrollTop = terminal.scrollHeight;
}

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = document.body.id;
    document.querySelector(`.navbar a[href="${currentPage}.html"]`).classList.add('active');
});
