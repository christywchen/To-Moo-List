import { getDate, setTaskDeadline, decorateTaskWithPriority, decorateTaskWithDeadline, buildListSelectOptions } from './create-dom-elements.js';
import { showCreateList } from './display.js';
import { listId } from './dashboard.js';

export let taskId;
export let moveTask;
// CRUD
// C
export function addTaskSummaryEventListeners() {
    const summaryTitleInp = document.querySelector('#summary-title');
    const summaryDeadlineInp = document.querySelectorAll('#summary-due-date-inp')[1];
    const summaryListSelectInp = document.querySelector('#summary-list-select');
    const summaryPrioritySelectInp = document.querySelector('#summary-priority-select');
    const summaryDescInp = document.querySelector('#summary-desc-textarea');

    summaryTitleInp.addEventListener('blur', changeTaskName);
    summaryDeadlineInp.addEventListener('change', changeTaskDeadline);
    summaryListSelectInp.addEventListener('change', changeList);
    summaryPrioritySelectInp.addEventListener('change', changePriority);
    summaryDescInp.addEventListener('focus', expandTextarea);
    summaryDescInp.addEventListener('blur', shrinkTextarea);
    summaryDescInp.addEventListener('blur', changeDesc);
}

// E
export async function changeTaskName(e) {
    taskId = window.location.href.split('/')[7];
    const newTaskName = e.target.innerText;
    const body = { name: newTaskName }

    if (newTaskName) {
        const res = await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const taskLabel = document.querySelector(`label[data-task="${taskId}"]`);
        taskLabel.innerText = newTaskName;
    } else {
        const { task } = await res.json();

        const summaryTitleInp = document.querySelector('#summary-title');
        summaryTitleInp.innerText = task.name;
    }
};

export async function changeTaskDeadline(e) {
    taskId = window.location.href.split('/')[7];
    let newDeadline = e.target.value;
    let body;

    // create body with new deadline
    if (newDeadline === '') {
        body = { deadline: null };
    } else {
        console.log(newDeadline)
        newDeadline = new Date(newDeadline).toISOString().replace('T', ' ').replace('Z', '');
        console.log('new', newDeadline)
        body = { deadline: newDeadline };
    }

    const updatedRes = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    const { task: updatedTask } = await updatedRes.json();

    updateDeadlineTag(updatedTask);
};


export async function changeList(e) {
    e.stopPropagation();
    taskId = window.location.href.split('/')[7];
    const newListId = e.target.value;

    if (newListId === "create-new") {
        moveTask = true;
        const change = () => {
            return new Promise((res, rej) => {
                showCreateList();
                res();
            });
        }
        await change();

    } else {
        moveTasktoExistingList(taskId, e);
    }
};

export async function moveTaskToNewList(taskId, newListId) {
    console.log('inside', taskId, newListId)
    const body = { listId: newListId };

    const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    const { task: updatedTask } = await res.json();

    console.log(updatedTask)
    moveTask = false;

}

export async function moveTasktoExistingList(taskId, e) {
    const newListId = e.target.value;
    const body = { listId: parseInt(newListId, 10) }

    const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const { task: updatedTask } = await res.json();

    await moveTaskFromList(updatedTask);
}

export async function changePriority(e) {
    e.stopPropagation();
    taskId = window.location.href.split('/')[7];
    const newPriorityId = e.target.value;

    // get info about original priority level
    const res = await fetch(`/api/tasks/${taskId}`);
    const { task } = await res.json();
    const origPriorityId = task.categoryId;

    const body = { categoryId: parseInt(newPriorityId, 10) }
    const updatedRes = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    const { task: updatedTask } = await updatedRes.json();

    updatePriorityTag(updatedTask, newPriorityId, origPriorityId);
};

export async function changeDesc(e) {
    taskId = window.location.href.split('/')[7];
    const newTaskDesc = e.target.value;
    const body = { description: newTaskDesc };

    const res = await fetch(`/api/tasks/${taskId}`);
    const { task } = await res.json();
    const oldTaskDesc = task.description;

    if (newTaskDesc) {
        await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (newTaskDesc !== oldTaskDesc) {
            markSaved('#summary-desc');
        }
    };
};

export async function expandTextarea(e) {
    const summaryDescInp = document.querySelector('#summary-desc-textarea');
    summaryDescInp.classList.add('summary-inp-focus');
}

export async function shrinkTextarea(e) {
    const summaryDescInp = document.querySelector('#summary-desc-textarea');
    summaryDescInp.classList.remove('summary-inp-focus');
}

// helper functions to provide dom changes after a task is edited
function markSaved(parentDiv) {
    let listDiv;

    if (parentDiv === '#deadline-div') {
        listDiv = document.querySelectorAll(parentDiv)[1];
    } else {
        listDiv = document.querySelector(parentDiv);
    }

    const span = document.createElement('span');
    span.classList.add('mark-saved')
    span.innerHTML = 'Saved!';
    listDiv.appendChild(span)

    setTimeout(() => {
        listDiv.removeChild(span)
    }, 1000);
}

export async function updatePriorityTag(task, origPriorityId) {
    if (task.categoryId !== origPriorityId || origPriorityId === null) {
        markSaved('#priority-div');
        const taskDiv = document.querySelector(`div[data-task="${task.id}"]`);
        const oldSpan = taskDiv.children[2];
        const newSpan = await decorateTaskWithPriority(taskDiv, task)
        if (oldSpan) oldSpan.replaceWith(newSpan);
        else taskDiv.appendChild(newSpan)
    }
}

export async function updateDeadlineTag(task) {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const taskDiv = document.querySelector(`div[data-task="${task.id}"]`);
    let origDeadline = taskDiv.childNodes[5].innerText;
    let newDeadline = new Date(task.deadline)

    newDeadline = new Intl.DateTimeFormat('en-US', options).format(newDeadline).split(', ')[1];

    if (origDeadline !== newDeadline || origDeadline === null) {
        markSaved('#deadline-div');
        const oldSpan = taskDiv.children[3];
        const newSpan = await decorateTaskWithDeadline(task.id, task)
        if (oldSpan) oldSpan.replaceWith(newSpan);
        else taskDiv.appendChild(newSpan)
    }
}

async function moveTaskFromList(task) {
    const stateId = { id: "99" };
    const location = window.location.href.split('/')[4];
    const oldListId = window.location.href.split('/')[5];

    if (location === '#list') {
        const taskContainer = document.querySelector('#tasksContainer');
        const movedTask = document.querySelector(`[data-task="${task.id}"]`);
        taskContainer.removeChild(movedTask);
        window.history.replaceState(stateId, `List ${oldListId}`, `/dashboard/#list/${oldListId}`);

        const taskDetailsDiv = document.querySelector('#task-details');
        taskDetailsDiv.classList.remove('task-details-display');
    } else {
        markSaved('#list-div');
        window.history.replaceState(stateId, `List ${task.listId}`, `/dashboard/${location}/${task.listId}/tasks/${task.id}`);
    }
}
