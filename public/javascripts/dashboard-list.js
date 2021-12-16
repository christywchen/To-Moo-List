let listId;

// Initialze Page
const initializePage = async () => {
    const res = await fetch('/api/lists')
    const { lists } = await res.json();
    const taskList = document.getElementById('task-lists');

    // might not need this
    listId = lists[0].id;

    lists.forEach(list => {
        const li = document.createElement('li');
        // if (!maxListId || list.id > maxListId) maxListId = list.id
        li.innerText = list.name;
        li.className = list.id;
        li.addEventListener('click', fetchListTasks);
        taskList.appendChild(li);
    });
};


// Custom Event Listeners
async function fetchTaskSummary (e) {
    const taskSummaryContainer = document.querySelector('#summary')
    const summaryRes = await fetch(`/api/tasks/${e.target.dataset.task}`);
    const { task } = await summaryRes.json();

    const taskSummary = document.createElement('div');
    taskSummary.classList.add('task-summary');
    taskSummary.innerHTML = `
        <div class="summary-title" contenteditable="true"><h2>task name</h2></div>
        <div class="summary-due-date">due date <span class="summary-due-date-container" contenteditable="true">due date</span></div>
        `
};

async function fetchListTasks(e) {
    e.preventDefault();
    const stateId = { id: "100" };
    const taskRes = await fetch(`/api/lists/${e.target.className}/tasks`)
    const { tasks } = await taskRes.json();
    console.log(taskRes)
    console.log(tasks)

    const taskContainer = document.getElementById("tasksContainer");
    tasks.forEach(task => {
        const div = document.createElement("div");
        div.setAttribute('data-task', `${task.id}`);
        div.classList.add('single-task')
        div.innerHTML = createTaskHtml(task.name, task.id);
        div.addEventListener('click', fetchTaskSummary);
        taskContainer.appendChild(div);
    })
    // TODO look into window.history.pushState
    // Look into remove listId from closure and get from fragment URL
    window.history.replaceState(stateId, `List ${e.target.className}`, `/dashboard/#list/${e.target.className}`);
};

const createTask = async (e) => {
    e.preventDefault();
    const taskData = document.querySelector('#add-task-input');
    const taskContainer = document.getElementById("tasksContainer");
    const formData = new FormData(taskData);
    const name = formData.get('name');
    const body = { name, listId };
    const div = document.createElement('div');
    const input = document.getElementById('name');
    div.classList.add('task')
    if (input.value.length) {
        // console.log(listId)
        console.log(name, listId)
        try {
            const res = await fetch(`/api/lists/${listId}`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" }
            })
            if (!res.ok) throw res // May need to change this
            else {
                div.innerHTML = createTaskHtml(name);
                taskContainer.appendChild(div);
                input.value = "";
            }
        } catch (err) {
            // TODO finish error handling
            console.error('-Unable to reach database-');
            alert('Opps there was a problem with the server') // TODO
        }
    }
};

const createList = async (e) => {
    e.preventDefault();
    const listForm = document.querySelector('#add-list-form');
    const listData = document.querySelector('#addList');
    const formData = new FormData(listForm);
    const name = formData.get('addList');
    const body = { name };
    const li = document.createElement('li');
    const tasksList = document.getElementById('task-lists');
    if (listData.value.length) {
        try {
            const res = await fetch('/api/lists', {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (!res.ok) throw res
                console.log(tasksList)
                const newList = await res.json()
                const listId = newList.list.id;
                li.className = listId;
                li.innerText = newList.list.name
                li.addEventListener('click', fetchListTasks);
                tasksList.appendChild(li);
        } catch (error) {

        }
    }
};

const hideTaskButton = (e) => {
    if (addTaskFormDiv.contains(e.target)) {
        e.preventDefault()
        addTaskButtonDiv.classList.add('add-task-button-transition');
    }
    else addTaskButtonDiv.classList.remove('add-task-button-transition');
};

const hideCreateTaskDiv = (e) => {
    // if (e.target.className)
    console.log(e.target.className)
    if ((!addListDiv.contains(e.target) &&
        e.target.className !== 'add-list-button') ||
        e.target.className === 'submit-list' ||
        e.target.className === 'cancel-submit-list') {
            e.preventDefault()
            addListDiv.style.display = 'none';
            const form = document.getElementById('addList');
            form.value = '';
    }
};

const showCreateList = async (e) => {
    e.preventDefault();
    addListDiv.style.display = 'block';
    addListDiv.style.position = 'fixed';
}

const showTaskButton = (e) => {
    e.preventDefault()
    if (addTaskInp.value) {
        addTaskButton.disabled = false;
    }
    else addTaskButton.disabled = true;
};


// -------
// Elements to append event listeners to
const addTaskFormDiv = document.querySelector('#add-task-form');
const addTaskInp = document.querySelector('input#name.inp-field');
const addTaskButtonDiv = document.querySelector('.add-task-button');
const addTaskButton = document.querySelector('.add-task-button button');
const addListButton = document.querySelector('.add-list-button');
const addListDiv = document.querySelector('#add-list');
const submitListButton = document.querySelector('.submit-list');

// Load events
window.addEventListener("load", async (event) => {
    initializePage();
    addTaskButton.addEventListener('click', createTask);
    document.addEventListener('click', hideTaskButton);
    document.addEventListener('click', hideCreateTaskDiv);
    addTaskInp.addEventListener('keyup', showTaskButton);
    addListButton.addEventListener('click', showCreateList);
    submitListButton.addEventListener('click', createList);
    submitListButton.addEventListener('click', hideCreateTaskDiv);
});
//-------


// Helper Functions

export function createTaskHtml(taskName, taskId) {
    return ` <input type="checkbox" data-task="${taskId}" name="${taskName}" value="${taskName}">
                <label for="${taskName}" data-task="${taskId}">${taskName}</label>
                <div hidden class='categories'>mwhahahah</div>`;
};
