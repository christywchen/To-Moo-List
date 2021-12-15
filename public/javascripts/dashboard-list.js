let listId;

// Initialze Page
const initializePage = async () => {
    const fetchTaskSummary = async (e) => {
        const taskSummaryContainer = document.querySelector('#summary')
        const summaryRes = await fetch(`/api/tasks/${e.target.dataset.task}`);
        const { task } = summaryRes.json();

        const taskSummary = document.createElement('div');
        taskSummary.classList.add('task-summary');
        taskSummary.innerHTML = `
        <div class="summary-title" contenteditable="true"><h2>task name</h2></div>
        <div class="summary-due-date">due date <span class="summary-due-date-container" contenteditable="true">due date</span></div>
        `

    }

    const fetchListTasks = async (e) => {
        e.preventDefault();
        const stateId = { id: "100" };
        const taskRes = await fetch(`/api/lists/${e.target.className}/tasks`)
        const { tasks } = await taskRes.json();
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
