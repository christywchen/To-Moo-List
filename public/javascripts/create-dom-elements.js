import { fetchListTasks, updateListId } from './dashboard.js';
import { clearDOMTasks } from './clean-dom.js';
import { updateList, deleteList } from './dashboard.js';
import { showRenameList, showCreateList, hideContainer, showContainer } from './display.js';

export function createListDiv(name, listId) {
    const container = document.createElement('div');
    const listDiv = document.createElement('div');
    container.className = 'list-box';
    container.style.position = 'relative';

    listDiv.innerText = name;
    listDiv.setAttribute('data-listId', `${listId}`);
    listDiv.className = 'list-item';

    const iconsBox = document.createElement('div');
    iconsBox.className = 'list-icons';
    const editIcon = document.createElement('div');
    // editIcon.innerText = 'v'
    // editIcon.className = '<i class="far fa-caret-square-down"></i>'
    editIcon.classList.add('far', 'fa-caret-square-down', 'hide-option')

    editIcon.setAttribute('data-listId', `${listId}`);


    container.appendChild(listDiv);
    container.appendChild(iconsBox);
    iconsBox.appendChild(editIcon);

    editIcon.addEventListener('click', updateListId);
    container.addEventListener('click', fetchListTasks);
    editIcon.addEventListener('click', async (e) => {
        await hideContainer('list-edit-dropdown');
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
        // const listEditDropdown = document.querySelector('.list-edit-option');
        // if(listEditDropdown) listEditDropdown.remove();

        const listEditDropdown = document.querySelector('.list-edit-dropdown');
        if (listEditDropdown) listEditDropdown.remove();
        showRenameList()
    })
    deleteListOp.addEventListener('click', deleteList);

    return container;
}


// div.setAttribute('data-task', `${task.id}`);
/// data-listId // e.target.dataset.listId
// document.querySelector(`[data-task="${taskId}"]`);

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
    const deadline = getDate(currentDeadline)
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


export function createTaskHtml(taskName, taskId, taskDeadline = '', categoryId = '') {
    // setting information regarding task deadline
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

    console.log(taskName, typeof todayDate, typeof deadlineDate)

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

    // return value for task item element
    return ` <input type="checkbox" data-task="${taskId}" name="${taskName}" value="${taskName}">
        <label for="${taskName}" data-task="${taskId}">${taskName}</label>
        <span data-task="${taskId}" class="category category-${categoryId}">${categoryId}</span>
        <span data-task="${taskId}" class="deadline deadline-${deadlineStatus}">${deadlineStr}</span>
`;
};

async function createTaskRecap() {

}
