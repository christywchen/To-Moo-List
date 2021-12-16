// import { createTaskDiv } from './dashboard-list'

const finishTask = () => console.log("hello world");

const completeTask = document.querySelector(".completed");

window.addEventListener("load", async (e) => {
    completeTask.addEventListener("click", finishTask);
})
