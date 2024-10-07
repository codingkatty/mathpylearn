let editor;

function showEditor(lesson) {
    document.getElementById('editor-container').style.display = 'flex';
    if (!editor) {
        editor = ace.edit("editor");
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/python");
    }
    editor.setValue(`# ${lesson} lesson\n# Start coding here`);
}

function runCode() {
    const code = editor.getValue();
    const terminal = document.getElementById('terminal');
    terminal.innerHTML += '> Running code...\n';
    terminal.innerHTML += code + '\n';
    terminal.innerHTML += '> Code execution completed.\n\n';
    terminal.scrollTop = terminal.scrollHeight;
}

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = document.body.id;
    document.querySelector(`.navbar a[href="${currentPage}.html"]`).classList.add('active');
});
