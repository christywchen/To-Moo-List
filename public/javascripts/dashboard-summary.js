import { markSaved, updatePriorityTag, updateDeadlineTag, moveTaskFromList, moveTaskFromPriority, moveTaskFromTodayOrTomorrow } from './display-task-updates.js';
import { showCreateList } from './display.js';

export let taskId;
export let moveTasktoNew;

export function addTaskSummaryEventListeners() {
    /*
    This function adds event listeners to html elements created by the buildTaskSummary function.
    */
    const summaryTitleInp = document.querySelector('#summary-title');
    const summaryDeadlineInp = document.querySelectorAll('#summary-due-date-inp')[1];
    const summaryListSelectInp = document.querySelector('#summary-list-select');
    const summaryPrioritySelectInp = document.querySelector('#summary-priority-select');
    const summaryDescInp = document.querySelector('#summary-desc-textarea');

    summaryTitleInp.addEventListener('blur', changeTaskName);
    if (summaryDeadlineInp) summaryDeadlineInp.addEventListener('change', changeTaskDeadline);
    summaryListSelectInp.addEventListener('change', changeList);
    summaryPrioritySelectInp.addEventListener('change', changePriority);
    summaryDescInp.addEventListener('focus', expandTextarea);
    summaryDescInp.addEventListener('blur', shrinkTextarea);
    summaryDescInp.addEventListener('blur', changeDesc);
}

// E
export async function changeTaskName(e) {
    /*
    This function updates the task name of each element by saving any changes made to the task name
    in the task summary panel when the div loses focus.
    It will make a fetch to the database in order to save
    */
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
    /*
    This function will save any deadline changes made in the task summary to the database.
    */
    taskId = window.location.href.split('/')[7];
    let newDeadline = e.target.value;
    let body;

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

    updateDeadlineTag(updatedTask);
    await moveTaskFromTodayOrTomorrow(updatedTask);
};


export async function changeList(e) {
    /*
    This function will save any list changes made in the task summary to the database.
    If the user chooses to create a new list, the function will go into a promise and then split off to the
    createList function, which will create a new list and complete the task with the help of moveTaskToNewList.
    Otherwise, it will split off to the moveTasktoExistingList to move the task to another existing list.
    */
    e.stopPropagation();
    taskId = window.location.href.split('/')[7];
    const newListId = e.target.value;

    if (newListId === "create-new") {
        moveTasktoNew = true;
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
    const body = { listId: newListId };

    const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    moveTasktoNew = false;
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
    /*
    This function will save any priority changes made in the task summary to the database.
    */
    e.stopPropagation();
    taskId = window.location.href.split('/')[7];
    const newPriorityId = e.target.value;

    const body = { priorityId: parseInt(newPriorityId, 10) }
    const updatedRes = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    const { task: updatedTask } = await updatedRes.json();

    updatePriorityTag(updatedTask);
    await moveTaskFromPriority(updatedTask);
};

export async function changeDesc(e) {
    /*
    This function will save any description changes made in the task summary to the database.
    */
    taskId = window.location.href.split('/')[7];
    const newTaskDesc = e.target.value;
    const body = { description: newTaskDesc };

    const res = await fetch(`/api/tasks/${taskId}`);
    const { task } = await res.json();
    const oldTaskDesc = task.description;

    if (newTaskDesc && oldTaskDesc !== newTaskDesc) {
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
    }
};

/*
The below functions will expand or shrink the textarea for the task description upon click.
*/
export async function expandTextarea(e) {
    const summaryDescInp = document.querySelector('#summary-desc-textarea');
    summaryDescInp.classList.add('summary-inp-focus');
}

export async function shrinkTextarea(e) {
    const summaryDescInp = document.querySelector('#summary-desc-textarea');
    summaryDescInp.classList.remove('summary-inp-focus');
}
