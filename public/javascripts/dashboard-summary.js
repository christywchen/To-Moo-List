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

export function addTaskSummaryEventListeners() {
    const summaryTitleInp = document.querySelector('#summary-title');
    const summaryDeadlineInp = document.querySelector('#summary-due-date-inp');
    const summarySelectInp = document.querySelector('#summary-list-select');
    const summaryDescInp = document.querySelector('#summary-desc-textarea');

    console.log(summaryTitleInp)
    summaryTitleInp.addEventListener('blur', changeTaskName);
    summaryDeadlineInp.addEventListener('blur', changeTaskDeadline);
    summarySelectInp.addEventListener('change', changeList);
    summaryDescInp.addEventListener('focus', expandTextarea);
    summaryDescInp.addEventListener('blur', changeDesc);
}

export const changeTaskName = async (e) => {
    const taskId = window.location.href.split('/')[7];
    const newTaskName = e.target.innerText;
    const body = { name: newTaskName }

    console.log(e.target.innerText)

    if (newTaskName) {
        await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const taskLabel = document.querySelector(`label[data-task="${taskId}"]`);
        taskLabel.innerText = newTaskName;
    } else {
        const res = await fetch(`/api/tasks/${taskId}`);
        const { task } = await res.json();

        const summaryTitleInp = document.querySelector('#summary-title');
        summaryTitleInp.innerText = task.name;
    }
};

export const changeTaskDeadline = async (e) => {
    // TO DO: patch request to update task deadline
};

export const changeList = async (e) => {
    e.stopPropagation();
    const stateId = { id: "99" };
    const listId = window.location.href.split('/')[5];
    const taskId = window.location.href.split('/')[7];

    const newlistId = e.target.value;


    console.log(newlistId)

    if (newlistId === "create-new") {
        addListDiv.style.display = 'block';
        addListDiv.style.position = 'fixed';
    } else {
        const body = { listId: parseInt(newlistId, 10) }
        await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    }

    const taskContainer = document.querySelector('#tasksContainer');
    const movedTask = document.querySelector(`[data-task="${taskId}"]`);
    taskContainer.removeChild(movedTask);
    showTaskSummary(false)

    window.history.replaceState(stateId, `List ${listId}`, `/dashboard/#list/${listId}`);
};

export const changeDesc = async (e) => {
    const taskId = window.location.href.split('/')[7];
    const newTaskDesc = e.target.value;
    const body = { description: newTaskDesc }

    if (newTaskDesc) {
        await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    };
};

export function showTaskSummary(visible) {
    const taskDetailsDiv = document.querySelector('#task-details');
    if (visible === true) {
        taskDetailsDiv.classList.add('task-details-display');
    } else {
        taskDetailsDiv.classList.remove('task-details-display');
    }
}

export async function expandTextarea(e) {
    const summaryDescInp = document.querySelector('#summary-desc-textarea');
    summaryDescInp.classList.add('summary-inp-focus');
}

export async function shrinkTextarea(e) {
    const summaryDescInp = document.querySelector('#summary-desc-textarea');
    summaryDescInp.classList.remove('summary-inp-focus');
}

// helper functions to build task summary
export function buildTitleDiv(currentTask) {
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
    deadlineDiv.innerHTML = `
            <div id="summary-deadline">Due Date</div>
            <input type="date" id="summary-due-date-inp" class="summary-inp"></input>
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

//-------
