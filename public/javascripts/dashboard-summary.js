import { getDate, setTaskDeadline, decorateTaskWithPriority, decorateTaskWithDeadline } from './create-dom-elements.js';
import { showCreateList } from './display.js';
// CRUD
// C
export function addTaskSummaryEventListeners() {
    const summaryTitleInp = document.querySelector('#summary-title');
    const summaryDeadlineInp = document.querySelector('#summary-due-date-inp');
    const summaryListSelectInp = document.querySelector('#summary-list-select');
    const summaryPrioritySelectInp = document.querySelector('#summary-priority-select');
    const summaryDescInp = document.querySelector('#summary-desc-textarea');

    summaryTitleInp.addEventListener('blur', changeTaskName);
    summaryDeadlineInp.addEventListener('blur', changeTaskDeadline);
    summaryListSelectInp.addEventListener('change', showCreateList);
    summaryPrioritySelectInp.addEventListener('change', changePriority);
    summaryDescInp.addEventListener('focus', expandTextarea);
    summaryDescInp.addEventListener('blur', shrinkTextarea);
    summaryDescInp.addEventListener('blur', changeDesc);
}

// E
export async function changeTaskName(e) {
    const taskId = window.location.href.split('/')[7];
    const newTaskName = e.target.innerText;
    const body = { name: newTaskName }

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

export async function changeTaskDeadline(e) {
    const taskId = window.location.href.split('/')[7];
    let newDeadline = e.target.value;
    let body;

    // get info about original deadline
    const res = await fetch(`/api/tasks/${taskId}`);
    const { task } = await res.json();
    const origDeadline = task.deadline;

    // create body with new deadline
    if (newDeadline === '') {
        body = { deadline: null };
    } else {
        newDeadline = new Date(newDeadline).toISOString().replace('T', ' ').replace('Z', '');
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

    // compare old deadline with new
    // show a confirmation of save if the deadline has changed
    // update the due date displayed in the main container


    updateDeadlineTag(taskId, updatedTask, newDeadline, origDeadline);
};

export async function changeList(e) {
    e.stopPropagation();
    const location = window.location.href.split('/')[4];
    const oldListId = window.location.href.split('/')[5];
    const taskId = window.location.href.split('/')[7];
    const newListId = e.target.value;

    if (newListId === "create-new") {
        showCreateList();
        // addListDiv.style.display = 'block';
        // addListDiv.style.position = 'fixed';
    } else {
        const body = { listId: parseInt(newListId, 10) }
        await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    }

    moveTaskFromList(location, taskId, oldListId, newListId);
};

export async function changePriority(e) {
    e.stopPropagation();
    const taskId = window.location.href.split('/')[7];
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

    updatePriorityTag(taskId, updatedTask, newPriorityId, origPriorityId);
};

export async function changeDesc(e) {
    const taskId = window.location.href.split('/')[7];
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

export async function expandCheckedTask(e) {

}

// helper functions to provide dom changes after a task is edited
function markSaved(parentDiv) {
    const listDiv = document.querySelector(parentDiv);
    const span = document.createElement('span');
    span.classList.add('mark-saved')
    span.innerHTML = 'Saved!';
    listDiv.appendChild(span)

    setTimeout(() => {
        listDiv.removeChild(span)
    }, 1000);
}

export async function updatePriorityTag(taskId, updatedTask, newPriorityId, origPriorityId) {
    if (newPriorityId !== origPriorityId || origPriorityId === null) {
        markSaved('#priority-div');
        const taskDiv = document.querySelector(`div[data-task="${taskId}"]`);
        const oldSpan = taskDiv.children[2];
        const newSpan = await decorateTaskWithPriority(taskDiv, updatedTask)
        if (oldSpan) oldSpan.replaceWith(newSpan);
        else taskDiv.appendChild(newSpan)
    }
}

async function updateDeadlineTag(taskId, updatedTask, newDeadline, origDeadline) {
    if (getDate(newDeadline) !== getDate(origDeadline) || origDeadline === null) {
        markSaved('#deadline-div');
        const taskDiv = document.querySelector(`div[data-task="${taskId}"]`);
        const oldSpan = taskDiv.children[3];
        const newSpan = await decorateTaskWithDeadline(taskDiv, updatedTask)
        if (oldSpan) oldSpan.replaceWith(newSpan);
        else taskDiv.appendChild(newSpan)
    }
}

function moveTaskFromList(location, taskId, oldListId, newListId) {
    const stateId = { id: "99" };
    if (location === '#list') {
        const taskContainer = document.querySelector('#tasksContainer');
        const movedTask = document.querySelector(`[data-task="${taskId}"]`);
        taskContainer.removeChild(movedTask);
        window.history.replaceState(stateId, `List ${oldListId}`, `/dashboard/#list/${oldListId}`);

        const taskDetailsDiv = document.querySelector('#task-details');
        taskDetailsDiv.classList.remove('task-details-display');
    } else {
        markSaved('#list-div');
        window.history.replaceState(stateId, `List ${newListId}`, `/dashboard/${location}/${newListId}/tasks/${taskId}`);
    }
}
