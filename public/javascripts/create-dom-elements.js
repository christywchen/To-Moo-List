import { fetchListTasks, updateListId } from './dashboard-list.js';
import { clearDOMTasks } from './clean-dom.js';


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
    editIcon.innerText = 'v'
    editIcon.setAttribute('data-listId', `${listId}`);
    // TO DO add image to icon box
    // make invisible edit icon


    container.appendChild(listDiv);
    container.appendChild(iconsBox);
    iconsBox.appendChild(editIcon);
    editIcon.addEventListener('click', (e) => {
        container.appendChild(listEditDropDown())
    });
    editIcon.addEventListener('click', updateListId);
    container.addEventListener('click', fetchListTasks);
    // container.appendChild(listEditDropDown());
    return container
}

// TO DO move all custom event listener funcitons into separate file


export function listEditDropDown() {
    const container = document.createElement('div');
    const renameListOp = document.createElement('div');
    const deleteListOp = document.createElement('div');
    renameListOp.innerText = 'Rename list';
    deleteListOp.innerText = 'Delete list';

    container.className = 'list-edit-dropdown'
    container.style.position = 'absolute';
    container.style.border = '1px red solid';

    [renameListOp, deleteListOp].forEach(option => {
        option.className = 'list-edit-option';
        container.appendChild(option);
    })
    renameListOp.addEventListener('click', showRenameList)
    deleteListOp.addEventListener('click', deleteList);

    return container;
    // e.target.appendChild(container);
}


async function deleteList (e) {
    console.log(e.target.parentNode.parentNode)
    e.stopPropagation()
    const list = e.target
        .parentNode.parentNode
        .querySelector('.list-item')
    console.log(list.dataset.listid)
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
        console.log('List deleted')
        list.remove();
        clearDOMTasks();
    }
}


async function updateList (e) {
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
}


const renameListDiv = document.querySelector('#rename-list');

export async function showRenameList(e) {
    // e.preventDefault();
    renameListDiv.style.display = 'block';
    renameListDiv.style.position = 'fixed';
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

    console.log(taskSummaryContainer)
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
function getDate() {
    let today = new Date();

    console.log(today)

    let month = today.getMonth() + 1;
    let date = today.getDate();
    let year = today.getFullYear();

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
    // TO DO: decide how to populate the deadline input box: dropdown with dates or manual input
    const deadlineDiv = document.createElement('div');
    deadlineDiv.setAttribute('id', 'deadline-div');
    const today = getDate();
    console.log(today)
    deadlineDiv.innerHTML = `
            <div id="summary-deadline">Due Date</div>
            <input type="date" min="${today}" id="summary-due-date-inp" class="summary-inp"></input>
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
