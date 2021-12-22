import { createTaskHtml } from './create-dom-elements.js';
import { clearDOMTasks } from './clean-dom.js';
import { fetchTaskSummary, fetchInboxTasks } from './dashboard.js';

const allTasks = document.getElementById("all");
const tomorrow = document.getElementById("tomorrow");
const today = document.getElementById("today");

const allTasksRoute = `/api/tasks`;
export const todayTasksRoute = `/api/tasks/today`;
const tomorrowTasksRoute = `/api/tasks/tomorrow`;

window.addEventListener("load", async (e) => {


    today.addEventListener('click', (e) => {
        const stateId = { id: "99" };
        clearDOMTasks();
        fetchInboxTasks(todayTasksRoute);
        window.history.replaceState(stateId, `Today`, `/dashboard/#today`);
    });

    tomorrow.addEventListener('click', (e) => {
        const stateId = { id: "99" };
        clearDOMTasks();
        fetchInboxTasks(tomorrowTasksRoute);
        window.history.replaceState(stateId, `Tomorrow`, `/dashboard/#tomorrow`);
    });

    allTasks.addEventListener("click", (e) => {
        const stateId = { id: "99" };
        clearDOMTasks();
        fetchInboxTasks(allTasksRoute);
        window.history.replaceState(stateId, `All`, `/dashboard/#all`);
    });
})

const taskDivs = document.querySelectorAll('.single-task')
if (taskDivs) {
    taskDivs.forEach(child => {
        child.remove();
    })
}
