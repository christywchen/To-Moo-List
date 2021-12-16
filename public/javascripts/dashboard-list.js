import { changeTaskName, changeTaskDeadline, changeList } from './dashboard-summary.js';

let listId;

// Initialze Page
const initializePage = async () => {
    const fetchTaskSummary = async (e) => {
        const stateId = { id: "99" };
        const taskSummaryContainer = document.querySelector('.task-details');
        const summaryRes = await fetch(`/api/tasks/${e.target.dataset.task}`);
        const { task } = await summaryRes.json();

        if (taskSummaryContainer.innerText.length) taskSummaryContainer.innerText = "";

        const currentTask = task.name;
        const currentTaskId = task.id;
        const currentListId = task.listId;
        const currentList = task.List.name;
        const taskSummary = document.createElement('div');
        taskSummary.classList.add('task-summary');

        const summaryTitle = document.createElement('div');
        summaryTitle.setAttribute('contenteditable', 'true');
        summaryTitle.setAttribute('id', 'summary-title');
        summaryTitle.innerHTML = `${currentTask}`;
        summaryTitle.setAttribute('class', 'summary-inp');

        // TO DO: decide how to populate the deadline input box
        const summaryDeadline = document.createElement('div');
        const summaryDeadlineInp = document.createElement('div');
        summaryDeadline.innerHTML = `Due Date`;
        summaryDeadline.setAttribute('id', 'summary-deadline');
        summaryDeadlineInp.setAttribute('contenteditable', 'true');
        summaryDeadlineInp.setAttribute('id', 'summary-due-date-inp');
        summaryDeadlineInp.setAttribute('class', 'summary-inp');

        const summaryList = document.createElement('div');
        const summaryListSelectDiv = document.createElement('div');
        const summaryListSelect = document.createElement('select');
        summaryListSelect.setAttribute('id', 'summary-list');
        summaryListSelect.setAttribute('class', 'summary-list-selections');
        summaryListSelectDiv.setAttribute('class', 'summary-list-select');
        summaryList.innerHTML = `List`;
        summaryListSelect.innerHTML = `<option value="${task.id}">${currentList}</option>`;


        summaryTitle.addEventListener('blur', changeTaskName);
        summaryDeadlineInp.addEventListener('blur', changeTaskName);
        summaryListSelect.addEventListener('change', changeList);


        summaryListSelectDiv.appendChild(summaryListSelect)
        taskSummary.appendChild(summaryTitle)
        taskSummary.appendChild(summaryDeadline)
        taskSummary.append(summaryDeadlineInp);
        taskSummary.appendChild(summaryDeadlineInp);
        taskSummary.append(summaryList);
        taskSummary.append(summaryListSelectDiv);



        window.history.replaceState(stateId, `Task ${currentTaskId}`, `/dashboard/#list/${currentListId}/tasks/${currentTaskId}`);

        // <div class="summary-descrip">
        //     description
        //     <span class="summary-descrip-textarea" contenteditable="true">
        //         <span class="summary-descrip-default">Add a description....</a>
        //     </div>
        // </div>
        // <div class="summary-is-complete"><button class="summary-mark-complete">Mark Complete</button></div>`

        taskSummaryContainer.appendChild(taskSummary)

        const listsRes = await fetch(`/api/lists`);
        const { lists } = await listsRes.json();
        const listOptions = document.querySelector('.summary-list-options');

        lists.forEach(list => {
            if (list.name !== currentList) {
                const listOpt = document.createElement('option');
                listOpt.setAttribute('value', list.id);
                listOpt.innerText = list.name;
                summaryListSelect.appendChild(listOpt);
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
