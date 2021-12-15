//import {hello} from './dashboard-list.js';

window.addEventListener("load", async (e) => {
    
    const allTasks = document.getElementById("all");
    const tomorrow = document.getElementById("tomrrow");
    const today = document.getElementById("today");

    const todaysDate = new Date().toISOString().split('T')[0]; 

    today.addEventListener("click", async (e) => {
        e.preventDefault();
        const taskRes = await fetch(`/api/tasks/2021-12-14`); // need to change later
        const { tasks } = await taskRes.json();
        const taskContainer = document.getElementById("tasksContainer");

        tasks.forEach(task => {
            const div = document.createElement("div");
            div.innerHTML = `
            <input type="checkbox" id="${task.name}" name="${task.name}" value="${task.name}">
            <label for="${task.name}">${task.name}</label>
            <div hidden class='categories'>mwhahahah</div>
            `
            taskContainer.appendChild(div);
        })
        //hello();
    })

    allTasks.addEventListener("click", async (e) => {
        const taskRes = await fetch(`/api/tasks`);
        const { tasks } = await taskRes.json();
        const taskContainer = document.getElementById("taskContainer");
        tasks.forEach(task => {
            const div = document.createElement("div");
            div.innerHTML = `
            <input type="checkbox" id="${task.name}" name="${task.name}" value="${task.name}">
            <label for="${task.name}">${task.name}</label>
            <div hidden class='categories'>mwhahahah</div>
            `
            taskContainer.appendChild(div);
        })
    });
})
