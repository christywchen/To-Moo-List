import { fetchListTasks, updateListId } from './dashboard.js';
import { clearDOMTasks } from './clean-dom.js';
import { fetchTaskSummary, deleteList, deleteTask } from './dashboard.js';
import { showRenameList, hideContainer, showContainer } from './display.js';
import { finishTask, getDropMenu } from './dashboard-tasks.js'



export function createSidebarContainer(name, containerType, data,) {

    const container = document.createElement('div');
    const itemDiv = document.createElement('div');
    container.classList.add(`${containerType}-box`, 'sidebar-box');
    container.style.position = 'relative';

    itemDiv.innerText = name;
    itemDiv.setAttribute(`data-${containerType}Id`, `${data}`);
    itemDiv.className = `${containerType}-item`;

    const iconsBox = document.createElement('div');
    const editIcon = document.createElement('div');
    iconsBox.className = `sidebar-icons`;
    editIcon.classList.add('far', 'fa-caret-square-down', 'hide-option')
    editIcon.setAttribute(`data-${containerType}Id`, `${data}`);


    container.appendChild(itemDiv);
    container.appendChild(iconsBox);
    iconsBox.appendChild(editIcon);

    editIcon.addEventListener('click', updateListId);
    container.addEventListener('click', fetchListTasks);
    editIcon.addEventListener('click', async (e) => {
        await hideContainer(`${containerType}-edit-dropdown`);
        await showContainer(container, listEditDropDown);
    });
    return container
}

// FIND OPTION DROPDOWN

export function listEditDropDown() {
    const container = document.createElement('div');
    const renameListOp = document.createElement('div');
    const deleteListOp = document.createElement('div');
    renameListOp.innerText = 'Rename list';
    deleteListOp.innerText = 'Delete list';

    container.className = 'list-edit-dropdown'
    container.style.position = 'absolute';

    [renameListOp, deleteListOp].forEach(option => {
        option.className = 'list-edit-option';
        container.appendChild(option);
    })
    renameListOp.addEventListener('click', (e) => {
        const listEditDropdown = document.querySelector('.list-edit-dropdown');
        if (listEditDropdown) listEditDropdown.remove();
        showRenameList()
    })
    deleteListOp.addEventListener('click', deleteList);

    return container;
}

export function populateTasks(tasks) {
    if (!Array.isArray(tasks)) tasks = [tasks];
    const tasksContainer = document.getElementById("tasksContainer");

    tasks.forEach(task => {
        const div = document.createElement("div");
        decorateTaskDiv(div, task);
        tasksContainer.appendChild(div);
    });
};

async function decorateTaskDiv(div, task) {
    div.setAttribute('data-task', `${task.id}`);
    div.classList.add('single-task')
    div.innerHTML = createTaskHtml(task.name, task.id);
    div.addEventListener('click', fetchTaskSummary);
    div.addEventListener('click', finishTask);
    div.addEventListener('click', deleteTask);
    div.addEventListener('click', getDropMenu);

    if (task.categoryId) await decorateTaskWithCategory(div, task);
    if (task.deadline) await decorateTaskWithDeadline(div, task);
};

async function decorateTaskWithCategory(div, taskObj) {
    const res = await fetch(`/api/tasks/${taskObj.id}`);
    const { task } = await res.json();

    const span = document.createElement('span');
    span.setAttribute('data-task', `${task.id}`);
    span.classList = `category category-${task.Category.name}`;
    span.innerText = `${task.Category.name}`;
    div.appendChild(span);
}

async function decorateTaskWithDeadline(div, task) {
    const [deadlineStatus, deadlineStr] = setTaskDeadline(task.deadline);
    const span = document.createElement('span');

    span.setAttribute('data-task', `${task.id}`);
    span.classList = `deadline deadline-${deadlineStatus}`;
    span.innerText = `${deadlineStr}`;
    div.appendChild(span);
}


// CREATING TASK SUMMARY CONTAINER ELEMENTS
export async function buildTaskSummary(currentTask, currentDeadline, currentTaskId, currentListId, currentList, currentDesc) {
    const taskSummaryContainer = document.createElement('div');
    const taskSummaryParent = document.querySelector('#task-details');

    if (taskSummaryParent.innerText.length) taskSummaryParent.innerText = "";

    taskSummaryContainer.setAttribute('id', 'task-editor');
    taskSummaryContainer.appendChild(buildTitleDiv(currentTask));
    taskSummaryContainer.appendChild(buildDeadlineDiv(currentDeadline));
    taskSummaryContainer.appendChild(buildListDiv(currentListId, currentList));
    taskSummaryContainer.appendChild(buildDescDiv(currentDesc));

    taskSummaryParent.appendChild(taskSummaryContainer);

    const listsRes = await fetch(`/api/lists`);
    const { lists } = await listsRes.json();
    const listOptions = document.querySelector('#summary-list-select');

    lists.forEach(list => {
        if (list.name !== currentList) {
            const listOpt = document.createElement('option');
            listOpt.setAttribute('value', list.id);
            listOpt.innerText = list.name;
            listOptions.appendChild(listOpt);
        }
    });

    const createListOpt = document.createElement('option');
    createListOpt.setAttribute('value', 'create-new');
    createListOpt.innerText = 'Create New';
    listOptions.appendChild(createListOpt);
}

// TASK SUMMARY CONTAINER HELPER FUNCTIONS
function getDate(day) {
    let getDay;
    if (day) getDay = new Date(day);
    else getDay = new Date()

    let month = getDay.getMonth() + 1;
    let date = getDay.getDate();
    let year = getDay.getFullYear();

    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;

    return `${year}-${month}-${date}`;
}

function buildTitleDiv(currentTask) {
    const titleDiv = document.createElement('div');
    titleDiv.setAttribute('id', 'title-div');
    titleDiv.innerHTML = `
        <div id="summary-title" contenteditable="true" class="summary-inp">${currentTask}</div>`;

    return titleDiv;
}

function buildDeadlineDiv(currentDeadline) {
    const deadline = getDate(currentDeadline);
    const today = getDate();

    const deadlineDiv = document.createElement('div');
    deadlineDiv.setAttribute('id', 'deadline-div');

    deadlineDiv.innerHTML = `
            <div id="summary-deadline">Deadline</div>
            <input type="date" min="${today}" value="${deadline}" id="summary-due-date-inp" class="summary-inp"></input>
            `;
    return deadlineDiv;
}

function buildListDiv(currentListId, currentList) {
    const listDiv = document.createElement('div');
    listDiv.setAttribute('id', 'list-div');
    listDiv.innerHTML = `
        <div id="summary-list">List</div>
        <select id="summary-list-select" class="summary-inp">
            <option value="${currentListId}">${currentList}</option>
        </select>
        `;
    return listDiv;
}

function buildDescDiv(currentDesc) {
    const descDiv = document.createElement('div');
    descDiv.setAttribute('id', 'desc-div');
    let descText = '';
    if (currentDesc) {
        descText = currentDesc;
    }

    descDiv.innerHTML = `
        <div id="summary-desc">Task Details</div>
        <textarea id="summary-desc-textarea" class="summary-inp" placeholder="Add a description...">${descText}</textarea>
        `;
    return descDiv;
}


export function createTaskHtml(taskName, taskId) {
    return `<input type="checkbox" data-task="${taskId}" name="${taskName}" value="${taskName}">
        <label for="${taskName}" data-task="${taskId}">${taskName}</label>
    `;
};

function setTaskDeadline(taskDeadline) {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    let deadline = getDate(taskDeadline);
    let today = getDate();
    let deadlineStr = '';
    let deadlineStatus = 'soon'
    const [
        todayYear,
        todayMonth,
        todayDate
    ] = today.split('-').map(el => parseInt(el, 10));

    const [
        deadlineYear,
        deadlineMonth,
        deadlineDate
    ] = deadline.split('-').map(el => parseInt(el, 10));

    if (taskDeadline) {
        let deadline = new Date(taskDeadline);
        deadlineStr = new Intl.DateTimeFormat('en-US', options).format(deadline).split(', ')[1];

        // check if task is due today or tomorrow
        // if so, show deadline as 'today' or 'tomorrow'
        if (deadlineMonth === todayMonth) {
            if (deadlineDate === todayDate) { // mark task if deadline is due today
                deadlineStr = 'Today';
                deadlineStatus = 'today';
                console.log('today')
            } else if (deadlineDate === todayDate + 1) { // mark task if deadline is due tomorrow
                deadlineStr = 'Tomorrow';
            }
        }

        if (deadlineYear <= todayYear &&
            deadlineMonth <= todayMonth &&
            deadlineDate < todayDate) {
            deadlineStatus = 'overdue';
        }
    } else {
        deadlineStatus = 'none';
    }

    return [deadlineStatus, deadlineStr];
}
