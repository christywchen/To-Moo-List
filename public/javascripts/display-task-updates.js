import { getDate, setTaskDeadline, decorateTaskWithPriority, decorateTaskWithDeadline, buildListSelectOptions } from './create-dom-elements.js';

/*
The below helper functions provide changes to the DOM after a task is edited
for visual confirmation to the user.
*/
export function markSaved(parentDiv) {
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

export async function updatePriorityTag(task) {
    markSaved('#priority-div');
    const taskDiv = document.querySelector(`div[data-task="${task.id}"]`);
    const oldSpan = taskDiv.children[2];
    const newSpan = await decorateTaskWithPriority(taskDiv, task)
    if (oldSpan) oldSpan.replaceWith(newSpan);
    else taskDiv.appendChild(newSpan)
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

export async function moveTaskFromList(task) {
    const stateId = { id: "99" };
    const location = window.location.href.split('/')[4];
    const oldListId = window.location.href.split('/')[5];

    if (location === '#list' || location === '#priority') {
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

export async function moveTaskFromTodayOrTomorrow(task) {
    const stateId = { id: "99" };
    const location = window.location.href.split('/')[4];

    if (location === '#tomorrow' || location === '#today') {
        const taskContainer = document.querySelector('#tasksContainer');
        const movedTask = document.querySelector(`[data-task="${task.id}"]`);
        taskContainer.removeChild(movedTask);

        const taskDetailsDiv = document.querySelector('#task-details');
        taskDetailsDiv.classList.remove('task-details-display');
        window.history.replaceState(stateId, `List ${task.listId}`, `/dashboard/${location}`);
    }
}

/*
This function will update the task status bar on the right side of the page for pending,
complete, or due tasks.
*/
export async function updateTaskStatus() {
    const all = await fetch('/api/tasks/');
    const { tasks: allTasks } = await all.json();
    const todays = await fetch('/api/tasks/today');
    const { tasks: todaysTasks } = await todays.json();

    let inProgress = 0;
    let dueToday = 0;
    let completed = 0;

    allTasks.forEach(task => {
        if (task.isCompleted) completed++;
        else inProgress++;
    });

    todaysTasks.forEach(task => {
        if (!task.isCompleted) dueToday++;
    })

    const inProgressDiv = document.querySelector('#recap-in-progress');
    inProgressDiv.innerHTML = inProgress;

    const dueTodayDiv = document.querySelector('#recap-due-today');
    dueTodayDiv.innerHTML = dueToday;

    const completedDiv = document.querySelector('#recap-completed');
    completedDiv.innerHTML = completed;

}
