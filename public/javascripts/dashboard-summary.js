import { getDate, setTaskDeadline, decorateTaskWithDeadline } from './create-dom-elements.js';

export function addTaskSummaryEventListeners() {

    const summaryTitleInp = document.querySelector('#summary-title');
    const summaryDeadlineInp = document.querySelector('#summary-due-date-inp');
    const summarySelectInp = document.querySelector('#summary-list-select');
    const summaryDescInp = document.querySelector('#summary-desc-textarea');

    summaryTitleInp.addEventListener('blur', changeTaskName);
    //blur:event fires when an element has lost focus.
    summaryDeadlineInp.addEventListener('blur', changeTaskDeadline);
    summarySelectInp.addEventListener('change', changeList);
    summaryDescInp.addEventListener('focus', expandTextarea);
    summaryDescInp.addEventListener('blur', shrinkTextarea);
    summaryDescInp.addEventListener('blur', changeDesc);
}

//changeTaskName is fetching the taskname and taskId, and then store
// them in backend. After than assign the taskname to the label in 
// tasksummary
export const changeTaskName = async (e) => {
    const taskId = window.location.href.split('/')[7];
    //window.location.href return a string contains the whole URL
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

export const changeTaskDeadline = async (e) => {
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
        newDeadline = new Date(newDeadline).toISOString();
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
    if (getDate(newDeadline) !== getDate(origDeadline)) {
        markSaved('#deadline-div');
        const taskDiv = document.querySelector(`div[data-task="${taskId}"]`);
        console.log(taskDiv)
        const deadlineSpan = taskDiv.children[3];
        if (deadlineSpan) taskDiv.removeChild(deadlineSpan);
        decorateTaskWithDeadline(taskDiv, updatedTask)
    }
};

export const changeList = async (e) => {
    e.stopPropagation();
    const stateId = { id: "99" };
    const listName = window.location.href.split('/')[4];
    const listId = window.location.href.split('/')[5];
    const taskId = window.location.href.split('/')[7];
    const newlistId = e.target.value;

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

    if (listName === '#list') {
        const taskContainer = document.querySelector('#tasksContainer');
        const movedTask = document.querySelector(`[data-task="${taskId}"]`);
        taskContainer.removeChild(movedTask);
        window.history.replaceState(stateId, `List ${listId}`, `/dashboard/#list/${listId}`);

        const taskDetailsDiv = document.querySelector('#task-details');
        taskDetailsDiv.classList.remove('task-details-display');
    } else {
        markSaved('#list-div');
        window.history.replaceState(stateId, `List ${newlistId}`, `/dashboard/${listName}/${newlistId}/tasks/${taskId}`);
    }
};

export const changeDesc = async (e) => {
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

export function showTaskSummary(e) {
    // UPDATE FUNCTIONALITY TO ACCOMMODATE FOR WHEN LIST SELECTION CHANGES
    // const prevListSelection = window.location.href.split('/')[5];
    // const nextListSelection = e.target.dataset.listId;
    const prevTaskSelection = window.location.href.split('/')[7];
    const nextTaskSelection = e.target.dataset.task;
    const taskDetailsDiv = document.querySelector('#task-details');

    if (prevTaskSelection === nextTaskSelection) {
        if (taskDetailsDiv.classList.contains('task-details-display')) {
            taskDetailsDiv.classList.remove('task-details-display');
        } else {
            taskDetailsDiv.classList.add('task-details-display');
        }
    } else {
        taskDetailsDiv.classList.add('task-details-display');
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

export async function expandCheckedTask(e) {

}

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
