// import { createTaskDiv } from './dashboard-list'




export const finishTask = (e) => {
    const completeTask = document.querySelector(".completed");
    const taskId = e.target.dataset.task;
    completeTask.addEventListener("click", async (e) => {
        const res = await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ isCompleted: true })
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
    const taskId = url.split('/')[url.split('/').length - 1];

    const extendCal = document.querySelector(".postpone-dates");
    // console.log(e.target, e.target.getAttribute("value"));
    const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ deadline: `${e.target.getAttribute("value")}` })
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
    const taskId = url.split('/')[url.split('/').length - 1];
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
        body: JSON.stringify({ listId: `${e.target.id}` })
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

export const changeCategory = async (e) => {
    const tag = document.querySelector(".category");
    const taskId = e.target.dataset.task;

    // const res = await fetch(`/api/tasks/${taskId}`, {
    //     method: "PATCH",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({listId: `${e.target.id}`})
    // })
    // if (!res.ok) {
    //     console.log("Something went wrong");
    // } else {
    //     console.log("it worked");
    //     listMenu.style.display = 'none';
    //     const deleteDiv = document.querySelector(`[data-task="${taskId}"]`);
    //     deleteDiv.remove();
    // }
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

const createListDropDown = async () => {
    const res = await fetch('/api/lists')
    const { lists } = await res.json();

    const listMenu = document.querySelector(".list-of-lists");
    lists.forEach(list => {
        const listOption = document.createElement('div');
        listOption.innerHTML = `${list.name}`;
        listOption.setAttribute("class", "dropdown-row");
        listOption.setAttribute("id", list.id);
        listOption.setAttribute("name", list.name);
        listOption.setAttribute("value", list.name);
        listOption.addEventListener("click", moveTask);
        listMenu.appendChild(listOption);
    })
}

const createPostPoneList = async () => {
    const postponeList = document.querySelector('.postpone-dates');
    const today = new Date();
    const date = ["1 days", '2 days', '3 days', '4 days', '5 days']
    for (let i = 0; i < 5; i++) {
        today.setDate(today.getDate() + 1);
        const readable = new Date(today).toISOString().split('T')[0]
        const div = document.createElement('div');
        div.innerText = date[i] + " (" + readable + ")";
        div.setAttribute("name", "date");
        div.setAttribute("value", today);
        div.addEventListener("click", postPoneTask);
        postponeList.appendChild(div);
    }
}

const createTagList = async () => {
    const categoryList = document.querySelector('.list-of-tags');
    const tags = await fetch('/api/categories');
    const { categories } = await tags.json();
    categories.forEach(tag => {
        const div = document.createElement('div');
        div.innerText = tag.name
        div.setAttribute("name", tag.name);
        div.setAttribute("value", tag.name);
        div.addEventListener("click", changeCategory);
        categoryList.appendChild(div);
    });
}


export const createDropDownMenu = () => {
    createListDropDown();
    createPostPoneList();
    createTagList();
}
