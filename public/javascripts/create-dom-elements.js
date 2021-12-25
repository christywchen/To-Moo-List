import { fetchListTasks, fetchTaskSummary, updateListId, deleteList } from './dashboard.js';
import { clearDOMTasks, clearSearchRecs, clearTaskSummary } from './clean-dom.js';
import { showRenameList, hideContainer, showContainer, fadeBackground, deselectList, toggleListSelect, toggleTaskHighlight, toggleTaskSummary, showCreateList } from './display.js';
import { finishTask, getDropMenu, deleteTask, uncheckCheckBox, hideTaskOptions } from './dashboard-tasks.js'

export function createSidebarContainer(name, containerType, data,) {
    const container = document.createElement('div');
    const itemDiv = document.createElement('div');
    container.classList.add(`${containerType}-box`, 'sidebar-box');
    container.style.position = 'relative';
    container.setAttribute(`data-${containerType}Id`, `${data}`);

    itemDiv.innerText = name;
    itemDiv.setAttribute(`data-${containerType}Id`, `${data}`);
    itemDiv.className = `${containerType}-item`;

    container.appendChild(itemDiv);

    if (containerType === 'list') {
        const iconsBox = document.createElement('div');
        const editIcon = document.createElement('div');
        iconsBox.className = `sidebar-icons`;
        editIcon.classList.add('far', 'fa-caret-square-down', 'hide-option')
        editIcon.setAttribute(`data-${containerType}Id`, `${data}`);
        container.appendChild(iconsBox);
        iconsBox.appendChild(editIcon);

        editIcon.addEventListener('click', updateListId);
        editIcon.addEventListener('click', async (e) => {
            await hideContainer(`${containerType}-edit-dropdown`);
            await showContainer(container, listEditDropDown);
        });
    }

    return container;
}

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
        // fadeBackground();
    })
    deleteListOp.addEventListener('click', deleteList);

    return container;
}

export function decorateList(list) {
    list.addEventListener('click', (e) => {
        const iconTarget = e.target.classList.contains('far');
        const listOptionTarget = e.target.classList.contains('list-edit-option');
        
        if (!iconTarget && !listOptionTarget) {
            fetchListTasks(e);
            toggleListSelect(e);
        }
    });
};

export function populateTasks(tasks, getCompleted = false) {
    if (!Array.isArray(tasks)) tasks = [tasks];
    const tasksContainer = document.getElementById("tasksContainer");
    tasks.forEach(task => {
        const div = document.createElement("div");
        decorateTaskDiv(div, task);
        if (getCompleted) {
            if (task.isCompleted) {
                tasksContainer.appendChild(div);
            }
        } else {
            if (!task.isCompleted) {
                tasksContainer.appendChild(div);
            }
        }
    });
};

async function decorateTaskDiv(div, task) {
    const prioritySpan = await decorateTaskWithPriority(div, task);
    const deadlineSpan = await decorateTaskWithDeadline(div, task);
    
    div.setAttribute('data-task', `${task.id}`);
    div.classList.add('single-task');
    div.innerHTML = createTaskHtml(task.name, task.id);
    div.addEventListener('click', getDropMenu);
    div.addEventListener('click', toggleTaskHighlight);
    div.addEventListener('click', fetchTaskSummary);
    div.addEventListener('click', toggleTaskSummary);

    div.appendChild(prioritySpan);
    div.appendChild(deadlineSpan);
};

export async function decorateTaskWithPriority(div, taskObj) {
    const res = await fetch(`/api/tasks/${taskObj.id}`);
    const { task } = await res.json();

    const span = document.createElement('span');

    span.setAttribute('data-task', `${task.id}`);
    span.classList = `priority-tag priority-${task.Category.name}`;
    span.innerText = `${task.Category.name}`;

    return span;
}

export async function decorateTaskWithDeadline(div, task) {
    const [deadlineStatus, deadlineStr] = setTaskDeadline(task.deadline);
    const span = document.createElement('span');

    span.setAttribute('data-task', `${task.id}`);
    span.classList = `deadline-tag deadline-${deadlineStatus}`;
    span.innerText = `${deadlineStr}`;

    return span;
}

export function createTaskHtml(taskName, taskId) {
    return `<input type="checkbox" data-task="${taskId}" name="${taskName}" value="${taskName}">
        <label for="${taskName}" data-task="${taskId}">${taskName}</label>
    `;
};

export function populateSearchBox(tasks) {
    const recContainer = document.querySelector('.search-recommendations');
    recContainer.style.display = 'block';

    tasks.forEach(task => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        div.className = 'search-rec';
        span.innerText = task.name;
        div.appendChild(span);
        recContainer.appendChild(div);
        decorateSearchItem(div, task);
    });
};

function decorateSearchItem(div, task) {
    div.addEventListener('click', (e) => {
        deselectList();
        clearSearchRecs()
        clearDOMTasks()
        populateTasks(task);
    });
};

// create task summary
export async function buildTaskSummary(task) {
    const currentTask = task.name;
    const currentTaskId = task.id;
    const currentDeadline = task.deadline;
    const currentListId = task.listId;
    const currentList = task.List.name;
    const currentDesc = task.description;
    const currentPriorityId = task.categoryId;
    const currentPriority = task.Category.name;

    const taskSummaryContainer = document.createElement('div');
    const taskSummaryParent = document.querySelector('#task-details');

    clearTaskSummary();

    taskSummaryContainer.setAttribute('id', 'task-editor');
    taskSummaryContainer.appendChild(buildTitleDiv(currentTask));
    taskSummaryContainer.appendChild(buildDeadlineDiv(currentDeadline));
    taskSummaryContainer.appendChild(buildListDiv(currentListId, currentList));
    taskSummaryContainer.appendChild(buildPriorityDiv(currentPriorityId, currentPriority));
    taskSummaryContainer.appendChild(buildDescDiv(currentDesc));

    taskSummaryParent.appendChild(taskSummaryContainer);
    buildListSelectOptions(currentListId, currentList);
    buildPrioritySelectOptions(currentPriority, currentPriorityId);
}

// helper functions for task summary container
function buildTitleDiv(currentTask) {
    const titleDiv = document.createElement('div');
    titleDiv.setAttribute('id', 'title-div');
    titleDiv.innerHTML = `
        <div id="summary-title" contenteditable="true" class="summary-inp">${currentTask}</div>`;

    return titleDiv;
}

export function buildDeadlineDiv(currentDeadline) {
    const today = getDate();
    let deadline = '';

    if (currentDeadline) {
        deadline = getDate(currentDeadline);
    }

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
    // listDiv.addEventListener('click', showCreateList);
    listDiv.setAttribute('id', 'list-div');
    listDiv.innerHTML = `
    <div id="summary-list">List</div>
    <select id="summary-list-select" class="summary-inp">
    <option value="${currentListId}">${currentList}</option>
        </select>
        `;
    return listDiv;
}

function buildPriorityDiv(currentPriorityId, currentPriority) {
    const priorityDiv = document.createElement('div');
    priorityDiv.setAttribute('id', 'priority-div');
    priorityDiv.innerHTML = `
        <div id="summary-priority">Priority</div>
        <select id="summary-priority-select" class="summary-inp">
        </select>
        `;
    return priorityDiv;
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
};

export async function buildListSelectOptions(currentListId, currentList) {
    const listsRes = await fetch(`/api/lists`);
    const { lists } = await listsRes.json();
    const listOptions = document.querySelector('#summary-list-select');

    populateSelectOptions(lists, currentList, listOptions);

    const createListOpt = document.createElement('option');
    createListOpt.setAttribute('value', 'create-new');
    createListOpt.innerText = 'Create New';

    // createListOpt.addEventListener('change', showCreateList);

    listOptions.appendChild(createListOpt);
}

export async function buildPrioritySelectOptions(currentPriority, currentPriorityId) {
    const priorityRes = await fetch(`/api/categories`);
    const { categories } = await priorityRes.json();
    const priorityOptions = document.querySelector('#summary-priority-select');
    priorityOptions.innerHTML = `<option value="${currentPriorityId}">${currentPriority}</option>`
    populateSelectOptions(categories, currentPriority, priorityOptions);
}

function populateSelectOptions(table, currentSelectionName, selectHTMLElementName) {
    table.forEach(element => {
        if (element.name !== currentSelectionName) {
            const option = document.createElement('option');
            option.setAttribute('value', element.id);
            option.innerText = element.name;
            selectHTMLElementName.appendChild(option);
        }
    });
}

// date functions
export function getDate(day) {
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

export function setTaskDeadline(taskDeadline) {
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
