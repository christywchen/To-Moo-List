import { clearDOMTasks } from './clean-dom.js';
import { fetchInboxTasks } from './dashboard.js';

const allTasks = document.getElementById("all");
const tomorrow = document.getElementById("tomorrow");
const today = document.getElementById("today");
const completed = document.getElementById("completed");

export const allTasksRoute = `/api/tasks`;
export const todayTasksRoute = `/api/tasks/today`;
const tomorrowTasksRoute = `/api/tasks/tomorrow`;
const completedTasksRoute = `/api/tasks/completed`;

window.addEventListener("load", async (e) => {
    decorateInboxList(today, todayTasksRoute, 'today');
    decorateInboxList(tomorrow, tomorrowTasksRoute, 'tomorrow');
    decorateInboxList(allTasks, allTasksRoute, 'all');
    decorateInboxList(completed, completedTasksRoute, 'completed');
});

const taskDivs = document.querySelectorAll('.single-task')
if (taskDivs) {
    taskDivs.forEach(child => {
        child.remove();
    })
};

function decorateInboxList(list, route, urlName) {
    list.addEventListener('click', (e) => {
        const stateId = { id: "99" };
        clearDOMTasks();
        fetchInboxTasks(route);
        window.history.replaceState(stateId, `Today`, `/dashboard/#${urlName}`);
    })
};
