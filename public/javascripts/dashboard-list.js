import { buildTaskSummary, showTaskSummary, addTaskSummaryEventListeners } from './dashboard-summary.js';
import { finishTask, deleteTask, moveTask } from './dashboard-tasks.js';
import { clearDOMTasks } from './clean-dom.js';
import { createListDiv } from './create-dom-elements.js';

let listId;

// Initialze Page
const initializePage = async () => {
    // const fetchTaskSummary = async (e) => {
    //     console.log("halp")
    //     const stateId = { id: "99" };
    //     const summaryRes = await fetch(`/api/tasks/${e.target.dataset.task}`);
    //     const { task } = await summaryRes.json();

    //     const currentTask = task.name;
    //     const currentTaskId = task.id;
    //     const currentDeadline = task.deadline;
    //     const currentListId = task.listId;
    //     const currentList = task.List.name;
    //     const currentDesc = task.description;

    //     buildTaskSummary(currentTask, currentDeadline, currentTaskId, currentListId, currentList, currentDesc);
    //     addTaskSummaryEventListeners()
    //     showTaskSummary(true);

    //     window.history.replaceState(stateId, `Task ${task.id}`, `/dashboard/#list/${task.listId}/tasks/${task.id}`);
    // }

    const res = await fetch('/api/lists')
    const { lists } = await res.json();
    const taskList = document.getElementById('task-lists');

    // might not need this
    listId = lists[0].id;

    lists.forEach(list => {
        // const div = document.createElement('div');
        // div.innerText = list.name;
        // div.className = list.id;
        // --------- EDITING BELOW ---------------------------
        const div = createListDiv(list.name, list.id);
        div.addEventListener('click', fetchListTasks);
        taskList.appendChild(div);
        // ------------------------------------------------
    });
};


// Custom Event Listeners
async function fetchTaskSummary(e) {
    console.log("halp")
    const stateId = { id: "99" };
    const summaryRes = await fetch(`/api/tasks/${e.target.dataset.task}`);
    const { task } = await summaryRes.json();

    const currentTask = task.name;
    const currentTaskId = task.id;
    const currentDeadline = task.deadline;
    const currentListId = task.listId;
    const currentList = task.List.name;
    const currentDesc = task.description;

    buildTaskSummary(currentTask, currentDeadline, currentTaskId, currentListId, currentList, currentDesc);
    addTaskSummaryEventListeners()
    showTaskSummary(true);

    window.history.replaceState(stateId, `Task ${task.id}`, `/dashboard/#list/${task.listId}/tasks/${task.id}`);
};

export async function fetchListTasks(e) {
    // e.preventDefault();
    e.stopPropagation();
    clearDOMTasks();
    const stateId = { id: "100" };
    console.log(e.target);

    if (e.target.className = 'list-item') {
        // --------------------------------------------------
        listId = e.target.dataset.listid;
        const taskRes = await fetch(`/api/lists/${listId}/tasks`)
        const { tasks } = await taskRes.json();
        // ------------------------------------------------------------
        // TO DO make into function and move into create-dom-el file
        const taskContainer = document.getElementById("tasksContainer");
        tasks.forEach(task => {
            const div = document.createElement("div");
            div.setAttribute('data-task', `${task.id}`);
            div.classList.add('single-task')
            div.innerHTML = createTaskHtml(task.name, task.id);
            div.addEventListener('click', fetchTaskSummary);
            div.addEventListener('click', finishTask);
            div.addEventListener('click', deleteTask);
            div.addEventListener('click', moveTask);
            taskContainer.appendChild(div);
        })
    }
    // TODO look into window.history.pushState
    // Look into remove listId from closure and get from fragment URL
    window.history.replaceState(
        stateId, `List ${e.target.dataset.listid}`,
        `/dashboard/#list/${e.target.dataset.listid}`
    );
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
    div.classList.add('single-task')
    if (input.value.length) {
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
    // const div = document.createElement('div');
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
            const newList = await res.json()
            const listId = newList.list.id;
            const div = createListDiv(newList.list.name, listId);

            // div.className = listId;
            // div.innerText = newList.list.name
            // div.addEventListener('click', fetchListTasks);
            tasksList.appendChild(div);
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
    if (e.target.className !== 'logout') {
        if ((!addListDiv.contains(e.target) &&
            e.target.className !== 'add-list-button') ||
            e.target.className === 'submit-list' ||
            e.target.className === 'cancel-submit-list' ||
            e.target.className === 'close') {
            // e.preventDefault()
            addListDiv.style.display = 'none';
            const form = document.getElementById('addList');
            form.value = '';
        }
    }
};

async function showCreateList(e) {
    // e.preventDefault();
    console.log(addListDiv)
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
const closeListSubmission = document.querySelector('.close');

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
    closeListSubmission.addEventListener('click', hideCreateTaskDiv)
});
//-------


// Helper Functions
export function createTaskHtml(taskName, taskId) {
    return ` <input type="checkbox" data-task="${taskId}" name="${taskName}" value="${taskName}">
                <label for="${taskName}" data-task="${taskId}">${taskName}</label>
                <div hidden class='categories'>mwhahahah</div>`;
};
