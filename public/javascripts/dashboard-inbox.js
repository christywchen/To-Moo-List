import { createTaskHtml } from './create-dom-elements.js';
import { clearDOMTasks } from './clean-dom.js';
import { fetchTaskSummary } from './dashboard.js';

window.addEventListener("load", async (e) => {

    const allTasks = document.getElementById("all");
    const tomorrow = document.getElementById("tomorrow");
    const today = document.getElementById("today");

    const allTasksRoute = `/api/tasks`;
    const todayTasksRoute = `/api/tasks/today`;
    const tomorrowTasksRoute = `/api/tasks/tomorrow`;

    today.addEventListener('click', (e) => {
        const stateId = { id: "99" };
        clearDOMTasks();
        queryEvents(todayTasksRoute);
        window.history.replaceState(stateId, `Today`, `/dashboard/#today`);
    });

    tomorrow.addEventListener('click', (e) => {
        const stateId = { id: "99" };
        clearDOMTasks();
        queryEvents(tomorrowTasksRoute);
        window.history.replaceState(stateId, `Tomorrow`, `/dashboard/#tomorrow`);
    });

    allTasks.addEventListener("click", (e) => {
        const stateId = { id: "99" };
        clearDOMTasks();
        queryEvents(allTasksRoute);
        window.history.replaceState(stateId, `All`, `/dashboard/#all`);
    });
})

async function queryEvents(fetchPath) {
    const taskRes = await fetch(fetchPath);
    const { tasks } = await taskRes.json();
    const taskContainer = document.getElementById("tasksContainer");
    tasks.forEach(task => {
        console.log(task.Category)
        const div = document.createElement("div");
        div.className = 'single-task';
        div.innerHTML = createTaskHtml(task.name, task.id, task.deadline, task.Category.name);
        div.setAttribute('data-task', `${task.id}`);
        div.addEventListener('click', fetchTaskSummary);
        taskContainer.appendChild(div);
    })
}


const taskDivs = document.querySelectorAll('.single-task')
if (taskDivs) {
    taskDivs.forEach(child => {
        child.remove();
    })
}
