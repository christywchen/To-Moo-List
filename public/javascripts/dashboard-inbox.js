import { createTaskHtml } from './dashboard-list.js';
import { clearDOMTasks } from './clean-dom.js';

window.addEventListener("load", async (e) => {

    const allTasks = document.getElementById("all");
    const tomorrow = document.getElementById("tomorrow");
    const today = document.getElementById("today");

    const allTasksRoute = `/api/tasks`;
    const todayTasksRoute = `/api/tasks/today`;
    const tomorrowTasksRoute = `/api/tasks/tomorrow`;

    today.addEventListener('click', (e) => {
        clearDOMTasks();
        queryEvents(todayTasksRoute);
    });

    tomorrow.addEventListener('click', (e) => {
        clearDOMTasks();
        queryEvents(tomorrowTasksRoute);
    });

    allTasks.addEventListener("click", (e) => {
        clearDOMTasks();
        queryEvents(allTasksRoute);
    });
})

async function queryEvents(fetchPath) {
    const taskRes = await fetch(fetchPath);
    const { tasks } = await taskRes.json();
    const taskContainer = document.getElementById("tasksContainer");
    tasks.forEach(task => {
        const div = document.createElement("div");
        div.className = 'single-task';
        div.innerHTML = createTaskHtml(task.name);
        taskContainer.appendChild(div);
    })
}


const taskDivs = document.querySelectorAll('.single-task')
if (taskDivs) {
    taskDivs.forEach(child => {
        child.remove();
    })
}
