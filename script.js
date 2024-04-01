// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
    return `<li class="task" id="task-${task.id}">
                <div class="task-details">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Deadline: ${task.deadline}</p>
                </div>
                <button class="delete-task-btn">Delete</button>
            </li>`;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    $('.task-list').empty();
    taskList.forEach(task => {
        let taskCard = createTaskCard(task);
        $(`#${task.status}-tasks`).append(taskCard);
    });
    $('.task').draggable({
        revert: "invalid",
        helper: "clone"
    });
}

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    let title = $('#taskTitle').val();
    let description = $('#taskDescription').val();
    let deadline = $('#taskDeadline').val();

    if (title && deadline) {
        let newTask = {
            id: generateTaskId(),
            title: title,
            description: description,
            deadline: deadline,
            status: 'todo' // Default status
        };
        taskList.push(newTask);
        saveTasks();
        renderTaskList(); // Update the task board
        $('#formModal').modal('hide'); // Close the modal
    } else {
        alert("Please enter title and deadline for the task.");
    }
}

// Function to handle deleting a task
function handleDeleteTask(event) {
    let taskId = $(event.target).closest('.task').attr('id').split('-')[1];
    taskList = taskList.filter(task => task.id != taskId);
    saveTasks();
    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId = ui.draggable.attr('id').split('-')[1];
    let newStatus = $(this).attr('id').split('-')[0];
    let taskIndex = taskList.findIndex(task => task.id == taskId);
    taskList[taskIndex].status = newStatus;
    saveTasks();
}

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
}

$(document).ready(function () {
    renderTaskList();
    $('#addTaskForm').submit(handleAddTask);
    $('.delete-task-btn').click(handleDeleteTask);
    $('.task-list').droppable({
        drop: handleDrop
    });
    // Other initialization code
});

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId = ui.draggable.attr('id').split('-')[1];
    let newStatus = $(this).attr('id').split('-')[0];
    let taskIndex = taskList.findIndex(task => task.id == taskId);
    
    // Update the status of the task
    taskList[taskIndex].status = newStatus;
    
    // Save the updated task list to localStorage
    saveTasks();
}

