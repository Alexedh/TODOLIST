let editIndex = -1;

// Cette fonction parcourt tous les éléments <li> de la liste des tâches et enregistre
// leur contenu texte dans un tableau, qui est ensuite sauvegardé dans localStorage.
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').textContent.trim(),
            completed: li.querySelector('input[type="checkbox"]').checked
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// loadTasks : Cette fonction lit les tâches depuis localStorage, les analyse et les ajoute 
//à la liste des tâches en appelant addTaskToDOM.
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.completed);
    });
}

//Cette fonction crée un élément de tâche (avec les boutons de suppression et d'édition) et l'ajoute à la liste des tâches
function addTaskToDOM(taskText, completed = false) {
//Ajout du paramètre completed pour indiquer si la tâche est terminée ou non.
    const taskList = document.getElementById("taskList");

    // Create new list item
    const li = document.createElement("li");

    // Create task details div
    const taskDetails = document.createElement("div");
    taskDetails.className = "task-details";

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
//La fonction onchange de la case à cocher appelle saveTasks pour enregistrer les modifications.
    checkbox.onchange = saveTasks;
    taskDetails.appendChild(checkbox);

    // Create task text span
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = taskText;
    taskDetails.appendChild(span);

    li.appendChild(taskDetails);

    // Create button container
    const buttonContainer = document.createElement("div");

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.onclick = function() {
        taskList.removeChild(li);
        saveTasks();
        displayMessage("Task deleted successfully!", "success");
    };
    buttonContainer.appendChild(deleteButton);

    // Create edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    editButton.onclick = function() {
        const taskInput = document.getElementById("taskInput");
        taskInput.value = taskText;
        editIndex = Array.from(taskList.children).indexOf(li);
        document.getElementById("addButton").textContent = "Update Task";
        displayMessage("", "");
    };
    buttonContainer.appendChild(editButton);

    // Append button container to list item
    li.appendChild(buttonContainer);

    // Append list item to task list
    taskList.appendChild(li);
}

//Elle vérifie si une tâche doit être ajoutée ou mise à jour, puis appelle saveTasks pour sauvegarder l'état actuel des tâches dans localStorage.
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        displayMessage("Task cannot be empty!", "error");
        return;
    }

    if (editIndex === -1) {
        // Add new task
        addTaskToDOM(taskText);
        displayMessage("Task added successfully!", "success");
    } else {
        // Update existing task
        const li = taskList.children[editIndex];
        li.querySelector('.task-text').textContent = taskText;
        editIndex = -1;
        document.getElementById("addButton").textContent = "Ajouter Un Task";
        displayMessage("Task updated successfully!", "success");
    }

    // Clear the input and save tasks
    taskInput.value = "";
    saveTasks();
}

// Function to display messages
function displayMessage(message, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    if (type === "success") {
        messageDiv.className = "message success";
    } else if (type === "error") {
        messageDiv.className = "message error";
    } else {
        messageDiv.className = "message";
    }
}

//Cela garantit que les tâches sont chargées depuis localStorage lorsque la page se charge.
window.onload = function() {
    loadTasks();
    
    

    // Attache un écouteur d'événements à l'input pour la touche "Entrer"
    document.getElementById("taskInput").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    });
};
