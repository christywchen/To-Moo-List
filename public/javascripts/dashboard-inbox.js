import { createTaskHtml } from './create-dom-elements.js';
import { clearDOMTasks } from './clean-dom.js';
import { fetchTaskSummary } from './dashboard.js';

window.addEventListener("load", async (e) => {
    // console.log(e)  //e.targe = document
    const allTasks = document.getElementById("all");
    const tomorrow = document.getElementById("tomorrow");
    const today = document.getElementById("today");

    const allTasksRoute = `/api/tasks`;
    ///why has api in front of tasks?
    const todayTasksRoute = `/api/tasks/today`;
    const tomorrowTasksRoute = `/api/tasks/tomorrow`;

    today.addEventListener('click', (e) => {
        const stateId = { id: "99" };
        clearDOMTasks();
        /// why need to remove the children tasks
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


//queryEvents is create a div for a task(class, html) and it will
// invoke a task summary by click.
async function queryEvents(fetchPath) {
    const taskRes = await fetch(fetchPath);
    const { tasks } = await taskRes.json();
    const taskContainer = document.getElementById("tasksContainer");
    tasks.forEach(task => {
        const div = document.createElement("div");
        div.className = 'single-task';
        div.innerHTML = createTaskHtml(task.name, task.id);
        //createTaskHtml return a css with checkbox,label,and hidden category
        div.setAttribute('data-task', `${task.id}`);
        //set a new attribute('data-task) to an element task.id
        div.addEventListener('click', fetchTaskSummary);
        //fetchTaskSummary is create a task summary for each task after click
        taskContainer.appendChild(div);
    })
}


const taskDivs = document.querySelectorAll('.single-task')
if (taskDivs) {
    taskDivs.forEach(child => {
        child.remove();
    })
}
