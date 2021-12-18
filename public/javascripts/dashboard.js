import { finishTask, postPoneTask, changeCategory, moveTask, getDropMenu, createDropDownMenu } from './dashboard-tasks.js';
import { showTaskSummary, addTaskSummaryEventListeners } from './dashboard-summary.js';
import { clearDOMTasks } from './clean-dom.js';
import { createListDiv, buildTaskSummary, createTaskHtml } from './create-dom-elements.js';
import { showTaskButton, hideTaskButton, showCreateList, hideListOptions, hideListNameDiv, hideDropDown } from './display.js';
import { updateTaskStatus } from './dashboard-recap.js';

let listId;

const initializePage = async () => {
    const res = await fetch('/api/lists')
    const { lists } = await res.json();
    const taskList = document.getElementById('task-lists');

    lists.forEach(list => {
        const div = createListDiv(list.name, list.id);
        div.addEventListener('click', fetchListTasks);
        taskList.appendChild(div);
    });

    const buttons = document.querySelectorAll('button')
    buttons.forEach(button => {
        if (button.className !== 'logout') {
            button.addEventListener('click', e => e.preventDefault())
        }
    })

    createDropDownMenu();
    updateTaskStatus();
};


// C-R-U-D Functions
// C
async function createTask(e) {
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
                div.innerHTML = createTaskHtml(name, task.id);
                div.setAttribute('data-task', `${task.id}`);

                console.log(task.id)

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

async function createList(e) {
    // e.preventDefault();
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
            tasksList.appendChild(div);
        } catch (error) {

        }
    }
};

// R
export async function fetchTaskSummary(e) {
    highlightTask(e);
    const stateId = { id: "99" };
    const listName = window.location.href.split('/')[4];
    const summaryRes = await fetch(`/api/tasks/${e.target.dataset.task}`);
    const { task } = await summaryRes.json();

    const currentTask = task.name;
    const currentTaskId = task.id;
    const currentDeadline = task.deadline;
    const currentListId = task.listId;
    const currentList = task.List.name;
    const currentDesc = task.description;

    buildTaskSummary(currentTask, currentDeadline, currentTaskId, currentListId, currentList, currentDesc);
    addTaskSummaryEventListeners();
    showTaskSummary(e);

    if (listName !== '#list') {
        window.history.replaceState(stateId, `Task ${task.id}`, `/dashboard/${listName}/${task.listId}/tasks/${task.id}`);
    } else {
        window.history.replaceState(stateId, `Task ${task.id}`, `/dashboard/#list/${task.listId}/tasks/${task.id}`);
    }
};


export async function fetchListTasks(e) {
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
    }
    window.history.replaceState(
        stateId, `List ${e.target.dataset.listid}`,
        `/dashboard/#list/${e.target.dataset.listid}`
    );
};

// U
export function updateListId(e) {
    listId = e.target.dataset.listid;
};

export const renameList = async (e) => {
    e.preventDefault();
    const listForm = document.querySelector('#rename-list-form');
    const listData = document.querySelector('#renameList');
    const formData = new FormData(listForm);
    const name = formData.get('renameList');
    const body = { name };

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

            console.log(listId)
            const list = document.querySelector(`[data-listid="${listId}"]`)
            list.innerText = name;

        } catch (error) {
        }
    }
};

export async function updateList(e) {
    const list = e.target
        .parentNode.parentNode
        .querySelector('.list-item')
    const listId = list.dataset.listid;

    const res = await fetch(`/api/lists/${listId}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
    })
};

// D
export async function deleteList(e) {
    e.stopPropagation()
    const list = e.target
        .parentNode.parentNode
        .querySelector('.list-item')
    const listId = list.dataset.listid;

    const res = await fetch(`/api/lists/${listId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
    })

    if (!res.ok) {
        console.log('Something went wrong')
    } else {
        // -- DOM removal isn't working
        console.log('List deleted')
        list.parentNode.remove();
        clearDOMTasks();
    }
};

export function deleteTask(e) {

    // const delteOccupied = querySelector.(DELETETASK)



    // if (!delete Occupied )
    // add class of DELETETASK
    // univeral selectors
    // do the following


    const trashTask = document.querySelector(".delete");
    const taskId = e.target.dataset.task;

    trashTask.addEventListener('click', async (e) => {
        const res = await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
        if (!res.ok) {
            console.log("Something went wrong")
        } else {
            console.log("Task deleted")
            const deleteDiv = document.querySelector(`[data-task="${taskId}"]`);
            deleteDiv.remove();
        }
    })
}


// -------
// Elements to append event listeners to
const addTaskFormDiv = document.querySelector('#add-task-form');
const addTaskButtonDiv = document.querySelector('.add-task-button');
const addListDiv = document.querySelector('#add-list');
const addTaskInp = document.querySelector('input#name.inp-field');
const addTaskButton = document.querySelector('.add-task-button button');
const addListButton = document.querySelector('.add-list-button');
const submitListButton = document.querySelector('.submit-list');
const closeListSubmission = document.querySelector('.close');
const renameListButton = document.querySelector('.rename-list');

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
function highlightTask(e) {
    const prevSelection = window.location.href.split('/')[7];
    const nextSelection = e.target.dataset.task;

    // const checkbox = document.querySelector(`.boxId-${e.target.dataset.task}`).checked = true;
    // if (checkbox.checked) {
    //     console.log("hello")
    // }
    // console.log(checkbox.checked);


    if (prevSelection) {
        const prevSelectionDiv = document.querySelector(`[data-task="${prevSelection}"]`);
        if (prevSelectionDiv) prevSelectionDiv.classList.remove('single-task-selected');
    }
    const nextSelectionDiv = document.querySelector(`[data-task="${nextSelection}"]`);
    nextSelectionDiv.classList.add('single-task-selected');

    // document.querySelector(`input[data-task="${nextSelection}"]`).click();
}

// TO DO: checkbox event listeners
async function checkedTaskActions(e) {
    if (e.target.checked) {
        console.log('hi')
    } else {
        console.log('bye')
    }
}
