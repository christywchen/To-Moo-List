let listId;

// Initialze Page
const initializePage = async () => {
    const fetchTaskSummary = async (e) => {
        const taskSummaryContainer = document.querySelector('#summary')
        const summaryRes = await fetch(`/api/tasks/${e.target.dataset.task}`);
        const { task } = await summaryRes.json();

        const currentTask = task.name;
        const currentList = task.List.name;
        const taskSummary = document.createElement('div');
        taskSummary.classList.add('task-summary');
        taskSummary.innerHTML = `
        <div class="summary-title" contenteditable="true">
            <h2>${currentTask}</h2>
        </div>
        <div class="summary-due-date">
            due date
            <span class="summary-due-date-container" contenteditable="true">
                due date
            </span>
        </div>
        <div class="summary-list">list
            <select class="summary-list-options">
            <option value="${task.id}">${currentList}</option>
            </select>
        </div>
        <div class="summary-descrip">
            description
            <span class="summary-descrip-textarea" contenteditable="true">
                <span class="summary-descrip-default">Add a description....</a>
            </div>
        </div>
        <div class="summary-is-complete"><button class="summary-mark-complete">Mark Complete</button></div>`

        taskSummaryContainer.appendChild(taskSummary)

        const listsRes = await fetch(`/api/lists`);
        const { lists } = await listsRes.json();
        const listOptions = document.querySelector('.summary-list-options');

        lists.forEach(list => {
            if (list.name !== currentList) {
                const listOpt = document.createElement('option');
                listOpt.setAttribute('value', list.id);
                listOpt.innerText = list.name;
                listOptions.appendChild(listOpt);
            }
        });

        const descriptionContainer = document.querySelector('.summary-descrip-textarea');

        if (task.description) {
            descriptionContainer.innerHTML = task.description;
        }

    }

    const fetchListTasks = async (e) => {
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

    const res = await fetch('/api/lists')
    const { lists } = await res.json();
    const taskList = document.getElementById('task-lists');
    listId = lists[0].id;

    lists.forEach(list => {
        const li = document.createElement('li');
        li.innerText = list.name
        li.className = list.id
        li.addEventListener('click', fetchListTasks);
        taskList.appendChild(li);
    });
}

// Helper Functions
export function createTaskHtml(taskName, taskId) {
    return ` <input type="checkbox" data-task="${taskId}" name="${taskName}" value="${taskName}">
                <label for="${taskName}" data-task="${taskId}">${taskName}</label>
                <div hidden class='categories'>mwhahahah</div>`;
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
        try {
            const res = await fetch(`api/lists/${listId}`, {
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
        // const addTaskInp = document.querySelector('input#name.inp-field');
        // addTaskInp.value = "";

    }
};

const hideTaskButton = (e) => {
    if (addTaskFormDiv.contains(e.target)) {
        e.preventDefault()
        addTaskButtonDiv.classList.add('add-task-button-transition');
    }
    else addTaskButtonDiv.classList.remove('add-task-button-transition');
};

const showTaskButton = (e) => {
    e.preventDefault()
    if (addTaskInp.value) {
        addTaskButton.disabled = false;
    }
    else addTaskButton.disabled = true;
};

const addTaskFormDiv = document.querySelector('#add-task-form');
const addTaskInp = document.querySelector('input#name.inp-field');
const addTaskButtonDiv = document.querySelector('.add-task-button');
const addTaskButton = document.querySelector('.add-task-button button');

// Load events
window.addEventListener("load", async (event) => {
    initializePage();
    addTaskButton.addEventListener('click', createTask);
    document.addEventListener('click', hideTaskButton);
    addTaskInp.addEventListener('keyup', showTaskButton);
});
