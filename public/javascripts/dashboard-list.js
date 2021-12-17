import { finishTask, deleteTask, postPoneTask, changeCategory, moveTask, getDropMenu } from './dashboard-tasks.js';
import { showTaskSummary, addTaskSummaryEventListeners } from './dashboard-summary.js';
//import { finishTask, deleteTask, moveTask } from './dashboard-tasks.js';
import { clearDOMTasks } from './clean-dom.js';
import { createListDiv, buildTaskSummary } from './create-dom-elements.js';

let listId;

// Initialze Page
const initializePage = async () => {
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

    function highLightTask() {
        const prevSelection = window.location.href.split('/')[7];
        const nextSelection = e.target.dataset.task;
        if (prevSelection) {
            const prevSelectionDiv = document.querySelector(`[data-task="${prevSelection}"]`);
            if (prevSelectionDiv) prevSelectionDiv.classList.remove('single-task-selected');
        }
        const nextSelectionDiv = document.querySelector(`[data-task="${nextSelection}"]`);
        nextSelectionDiv.classList.add('single-task-selected')
    }

    highLightTask()
    const stateId = { id: "99" };
    const summaryRes = await fetch(`/api/tasks/${e.target.dataset.task}`);
    const { task } = await summaryRes.json();

    const currentTask = task.name;
    const currentTaskId = task.id;
    const currentDeadline = task.deadline;
    const currentListId = task.listId;
    const currentList = task.List.name;
    const currentDesc = task.description;

    buildTaskSummary(
        currentTask,
        currentDeadline,
        currentTaskId,
        currentListId,
        currentList,
        currentDesc);
    addTaskSummaryEventListeners()
    showTaskSummary(true);

    window.history.replaceState(stateId, `Task ${task.id}`, `/dashboard/#list/${task.listId}/tasks/${task.id}`);
};

export async function fetchListTasks(e) {
    // console.log('click')
    // e.preventDefault();
    e.stopPropagation();
    clearDOMTasks();
    const stateId = { id: "100" };

    if (e.target.className === 'list-item') {
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
            div.addEventListener('click', getDropMenu);
            taskContainer.appendChild(div);
        })
        // TODO look into window.history.pushState
        // Look into remove listId from closure and get from fragment URL
        window.history.replaceState(stateId, `List ${e.target.className}`, `/dashboard/#list/${e.target.className}`);
    };

    const res = await fetch('/api/lists')
    const { lists } = await res.json();
    const taskList = document.getElementById('task-lists');

    // might not need this
    listId = lists[0].id;

    const listMenu = document.querySelector('.list-of-lists');
    lists.forEach(list => {
        const li = document.createElement('li');
        // if (!maxListId || list.id > maxListId) maxListId = list.id
        li.innerText = list.name;
        li.className = list.id;
        li.addEventListener('click', fetchListTasks);
        taskList.appendChild(li);

        //populates the list drop down menu
        const div = document.createElement('div');
        div.innerHTML = `${list.name}`;
        div.setAttribute("class", "dropdown-row");
        div.setAttribute("id", list.id);
        div.setAttribute("name", list.name);
        div.setAttribute("value", list.name);
        div.addEventListener("click", moveTask);
        listMenu.appendChild(div);
    });

    // creats & fill the hidden div with date objects
    const postponeList = document.querySelector('.postpone-dates');
    const today = new Date();
    const date = ["1 days", '2 days', '3 days', '4 days', '5 days' ]
    for(let i=0;i<5;i++){
        today.setDate(today.getDate() + 1);
        const readable = new Date(today).toISOString().split('T')[0]
        const div = document.createElement('div');
        div.innerText = date[i] + " (" + readable + ")";
        div.setAttribute("name", "date");
        div.setAttribute("value", today);
        div.addEventListener("click", postPoneTask);
        postponeList.appendChild(div);
    }

    // creats & fills the hidden div with category/tags
    const categoryList = document.querySelector('.list-of-tags');
    const tags = await fetch('/api/categories');
    const { categories } = await tags.json();
    categories.forEach( tag => {
        const div = document.createElement('div');
        div.innerText = tag.name
        div.setAttribute("name", tag.name);
        div.setAttribute("value", tag.name);
        div.addEventListener("click", changeCategory);
        categoryList.appendChild(div);
    });
};


// // Custom Event Listeners
// async function fetchTaskSummary(e) {
//     const taskSummaryContainer = document.querySelector('#summary')
//     const summaryRes = await fetch(`/api/tasks/${e.target.dataset.task}`);
//     const { task } = await summaryRes.json();

//     const taskSummary = document.createElement('div');
//     taskSummary.classList.add('task-summary');
//     taskSummary.innerHTML = `
//         <div class="summary-title" contenteditable="true"><h2>task name</h2></div>
//         <div class="summary-due-date">due date <span class="summary-due-date-container" contenteditable="true">due date</span></div>
//         `
// };

// async function fetchListTasks(e) {
//     e.preventDefault();
//     const stateId = { id: "100" };
//     const taskRes = await fetch(`/api/lists/${e.target.className}/tasks`)
//     const { tasks } = await taskRes.json();
//     const taskContainer = document.getElementById("tasksContainer");

//     tasks.forEach(task => {
//         const div = document.createElement("div");
//         div.setAttribute('data-task', `${task.id}`);
//         div.classList.add('single-task')
//         div.innerHTML = createTaskHtml(task.name, task.id);
//         div.addEventListener('click', fetchTaskSummary);
//         taskContainer.appendChild(div);
//     })
//     // TODO look into window.history.pushState
//     // Look into remove listId from closure and get from fragment URL
//     window.history.replaceState(
//         stateId, `List ${e.target.dataset.listid}`,
//         `/dashboard/#list/${e.target.dataset.listid}`
//     );
// };

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
                const { task } = await res.json();
                div.innerHTML = createTaskHtml(name);
                div.setAttribute('data-task', `${task.id}`);
                div.addEventListener('click', fetchTaskSummary);
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

export const renameList = async (e) => {
    e.preventDefault();
    const listForm = document.querySelector('#rename-list-form');
    const listData = document.querySelector('#renameList');
    const formData = new FormData(listForm);
    const name = formData.get('renameList');
    const body = { name };
    // const listId =

    if (listData.value.length) {
        try {
            const res = await fetch(`/api/lists/${listId}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            if (!res.ok) throw res
            else console.log('List renamed')

        } catch (error) {

        }
    }
}

const hideTaskButton = (e) => {
    if (addTaskFormDiv.contains(e.target)) {
        e.preventDefault()
        addTaskButtonDiv.classList.add('add-task-button-transition');
    }
    else addTaskButtonDiv.classList.remove('add-task-button-transition');
};

function hideListOptions(e) {
    const box = document.querySelector('.list-edit-dropdown')
    if (box) box.remove();
}

const hideListNameDiv = (e) => {
    const addListDiv = document.querySelector('#add-list');
    const renameListDiv = document.querySelector('#rename-list')
    if (e.target.className !== 'logout') {
        if (((!addListDiv.contains(e.target) &&
            !renameListDiv.contains(e.target)) &&
            e.target.className !== 'add-list-button') ||
            e.target.className === 'submit-list' ||
            e.target.className === 'cancel-submit-list' ||
            e.target.className === 'close') {
            // e.preventDefault()
            addListDiv.style.display = 'none';
            renameListDiv.style.display = 'none';
            const form = document.getElementById('addList');
            form.value = '';
        }
    }
};


const hideDropDown = (e) => {
    if (e.target.className !== 'logout') {
        if (!listMenu.className.includes(e.target) &&
        !e.target.className.includes('grid-square') && 
        !e.target.className.includes('fas')){
            e.preventDefault()
            listMenu.style.display = 'none';
            postponeMenu.style.display = 'none';
            categoryList.style.display = 'none';
        }
    }
}

async function showCreateList(e) {
    // e.preventDefault();
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
const renameListButton = document.querySelector('.rename-list');

// have to refactor where can get all the dropdown menu
const listMenu = document.querySelector(".list-of-lists");
const postponeMenu = document.querySelector(".postpone-dates");
const categoryList = document.querySelector('.list-of-tags');

// Load events
window.addEventListener("load", async (event) => {
    initializePage();
    addTaskButton.addEventListener('click', createTask);
    document.addEventListener('click', hideTaskButton);
    document.addEventListener('click', hideListNameDiv);
    document.addEventListener('click', hideListOptions)
    //document.addEventListener('click', hideCreateTaskDiv);
    document.addEventListener('click', hideDropDown);
    addTaskInp.addEventListener('keyup', showTaskButton);
    addListButton.addEventListener('click', showCreateList);
    submitListButton.addEventListener('click', createList);
    submitListButton.addEventListener('click', hideListNameDiv);
    closeListSubmission.addEventListener('click', hideListNameDiv);
    renameListButton.addEventListener('click', renameList);
});
//-------


// Helper Functions
export function createTaskHtml(taskName, taskId) {
    return ` <input type="checkbox" data-task="${taskId}" name="${taskName}" value="${taskName}">
                <label for="${taskName}" data-task="${taskId}">${taskName}</label>
                <div hidden class='categories'>mwhahahah</div>`;
};

export function updateListId(e) {
    console.log(e.target.dataset.listid)
    listId = e.target.dataset.listid;
}
