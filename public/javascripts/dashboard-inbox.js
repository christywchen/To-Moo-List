import { createTaskHtml, decorateList } from './create-dom-elements.js';
import { clearDOMTasks } from './clean-dom.js';
import { fetchTaskSummary, fetchInboxTasks } from './dashboard.js';

const allTasks = document.getElementById("all");
const tomorrow = document.getElementById("tomorrow");
const today = document.getElementById("today");
const completed = document.getElementById("completed");

const allTasksRoute = `/api/tasks`;
export const todayTasksRoute = `/api/tasks/today`;
const tomorrowTasksRoute = `/api/tasks/tomorrow`;
const completedTasksRoute = `/api/tasks/completed`;

window.addEventListener("load", async (e) => {


    // today.addEventListener('click', (e) => {
    //     const stateId = { id: "99" };
    //     clearDOMTasks();
    //     fetchInboxTasks(todayTasksRoute);
    //     window.history.replaceState(stateId, `Today`, `/dashboard/#today`);
    // });
    decorateInboxList(today, todayTasksRoute, 'today');
    decorateInboxList(tomorrow, tomorrowTasksRoute, 'tomorrow');
    decorateInboxList(allTasks, allTasksRoute, 'all');
    decorateInboxList(completed, completedTasksRoute, 'completed');


    // tomorrow.addEventListener('click', (e) => {
    //     const stateId = { id: "99" };
    //     clearDOMTasks();
    //     fetchInboxTasks(tomorrowTasksRoute);
    //     window.history.replaceState(stateId, `Tomorrow`, `/dashboard/#tomorrow`);
    // });

    // allTasks.addEventListener("click", (e) => {
    //     const stateId = { id: "99" };
    //     clearDOMTasks();
    //     fetchInboxTasks(allTasksRoute);
    //     window.history.replaceState(stateId, `All`, `/dashboard/#all`);
    // });
})

const taskDivs = document.querySelectorAll('.single-task')
if (taskDivs) {
    taskDivs.forEach(child => {
        child.remove();
    })
}

function decorateInboxList(list, route, urlName){
    list.addEventListener('click', (e) => {
        const stateId = { id: "99" };
        clearDOMTasks();
        fetchInboxTasks(route);
        window.history.replaceState(stateId, `Today`, `/dashboard/#${urlName}`);
    })
}
