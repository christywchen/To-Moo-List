import { createTaskHtml } from './dashboard-list.js';

window.addEventListener("load", async (e) => {

    const allTasks = document.getElementById("all");
    const tomorrow = document.getElementById("tomrrow");
    const today = document.getElementById("today");
    const todaysDate = new Date().toISOString().split('T')[0];

    const allTasksRoute = `/api/tasks`;
    const todayTasksRoute = `/api/tasks/2021-12-14`;
    const tomorrowTasksRoute = '' // TODO

    today.addEventListener('click', (e) => {
        queryEvents(todayTasksRoute);
    });

    allTasks.addEventListener("click", (e) => {
        queryEvents(allTasksRoute);
    });
})

async function queryEvents(fetchPath) {
    const taskRes = await fetch(fetchPath);
    const { tasks } = await taskRes.json();
    const taskContainer = document.getElementById("tasksContainer");
    tasks.forEach(task => {
        const div = document.createElement("div");
        div.innerHTML = createTaskHtml(task.name);
        taskContainer.appendChild(div);
    })
}
