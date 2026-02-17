// Store tasks
let tasks = {
    todo: [],
    progress: [],
    done: []
};

// Load tasks when page loads
window.onload = function() {
    loadTasks();
    renderAll();
};

// Show add task form
function showForm(column) {
    document.getElementById('form-' + column).style.display = 'block';
}

// Hide add task form
function hideForm(column) {
    document.getElementById('form-' + column).style.display = 'none';
    document.getElementById('title-' + column).value = '';
    document.getElementById('desc-' + column).value = '';
}

// Add new task
function addTask(column) {
    const title = document.getElementById('title-' + column).value;
    const desc = document.getElementById('desc-' + column).value;
    
    if (!title) {
        alert('Please enter a title');
        return;
    }
    
    const task = {
        id: Date.now(),
        title: title,
        description: desc
    };
    
    tasks[column].push(task);
    saveTasks();
    renderColumn(column);
    hideForm(column);
}

// Delete task
function deleteTask(column, id) {
    tasks[column] = tasks[column].filter(task => task.id !== id);
    saveTasks();
    renderColumn(column);
}

// Render all columns
function renderAll() {
    renderColumn('todo');
    renderColumn('progress');
    renderColumn('done');
}

// Render one column
function renderColumn(column) {
    const container = document.getElementById(column);
    container.innerHTML = '';
    
    tasks[column].forEach(task => {
        const div = document.createElement('div');
        div.className = 'task';
        div.draggable = true;
        div.id = 'task-' + task.id;
        
        div.innerHTML = `
            <button class="delete-btn" onclick="deleteTask('${column}', ${task.id})">Delete</button>
            <h3>${task.title}</h3>
            <p>${task.description || ''}</p>
        `;
        
        // Drag events
        div.ondragstart = function(e) {
            e.dataTransfer.setData('taskId', task.id);
            e.dataTransfer.setData('fromColumn', column);
        };
        
        container.appendChild(div);
    });
    
    // Allow drop
    container.ondragover = function(e) {
        e.preventDefault();
    };
    
    container.ondrop = function(e) {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('taskId'));
        const fromColumn = e.dataTransfer.getData('fromColumn');
        moveTask(fromColumn, column, taskId);
    };
}

// Move task between columns
function moveTask(from, to, taskId) {
    if (from === to) return;
    
    const task = tasks[from].find(t => t.id === taskId);
    if (!task) return;
    
    tasks[from] = tasks[from].filter(t => t.id !== taskId);
    tasks[to].push(task);
    
    saveTasks();
    renderColumn(from);
    renderColumn(to);
}

// Save to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load from localStorage
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    }
}

