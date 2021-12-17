// import { createTaskDiv } from './dashboard-list'


export const finishTask = (e) => {
    const completeTask = document.querySelector(".completed");
    const taskId = e.target.dataset.task;
    completeTask.addEventListener("click", async(e) =>{
        const res = await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({isCompleted: true})
        });
        if (!res.ok) {
            console.log("Something went wrong")
        } else {
            console.log("it worked")
        }
    })
}

export const postPoneTask = async (e) => {
    const url = window.location.href
    const taskId = url.split('/')[url.split('/').length-1];

    const extendCal = document.querySelector(".postpone-dates");
    // console.log(e.target, e.target.getAttribute("value"));
    const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({deadline: `${e.target.getAttribute("value")}`})
    })
    if (!res.ok) {
        console.log("Something went wrong");
    } else {
        console.log("it worked");
        extendCal.style.display = 'none';
    }
}

export const moveTask = async (e) => {
    const url = window.location.href
    const taskId = url.split('/')[url.split('/').length-1];
    // const moveCal = document.querySelector(".moveTo");
    // const taskId = e.target.dataset.task;

    // // building a toggle to show list
    const listMenu = document.querySelector('.list-of-lists');

    // moveCal.addEventListener("click", async (e) => {
    // listMenu.style.display = 'block';
    const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({listId: `${e.target.id}`})
    })
    if (!res.ok) {
        console.log("Something went wrong");
    } else {
        console.log("it worked");
        listMenu.style.display = 'none';
        const deleteDiv = document.querySelector(`[data-task="${taskId}"]`);
        deleteDiv.remove();
    }
    // })
}

export const changeCategory = async(e) => {
    const tag = document.querySelector(".category");
}

export const deleteTask = (e) => {
    const trashTask = document.querySelector(".delete");
    const taskId = e.target.dataset.task;

    trashTask.addEventListener('click', async (e) => {
        const res = await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
        if (!res.ok) {
            console.log("Something went wrong")
        } else {
            console.log("Task deleted")
            const deleteDiv = document.querySelector(`[data-task="${taskId}"]`);
            deleteDiv.remove();
        }
    })
}

export const getDropMenu = (e) => {

    const listMenu = document.querySelector('.list-of-lists');
    const moveCal = document.querySelector('.moveTo');
    moveCal.addEventListener('click', (e) => {
        listMenu.style.display = 'block';
    })

    const postponeList = document.querySelector('.postpone-dates');
    const helpCal = document.querySelector('.postpone');
    helpCal.addEventListener('click', (e) => {
        postponeList.style.display = 'block';
    })

    const categoryList = document.querySelector('.list-of-tags');
    const tag = document.querySelector('.category');
    tag.addEventListener('click', (e) => {
        categoryList.style.display = 'block';
    })
}
