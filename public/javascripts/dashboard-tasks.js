import { showCreateList } from './display.js'

export const finishTask = (e) => {
    const completeTask = document.querySelector(".completed");
    completeTask.addEventListener("click", async (e) => {
        const selectedTasks = document.querySelectorAll(".single-task > input");
        selectedTasks.forEach(async (e) => {
            if (e.checked) {
                const res = await fetch(`/api/tasks/${e.dataset.task}`, {
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
                    const deleteDiv = document.querySelector(`[data-task="${e.dataset.task}"]`);
                    if (deleteDiv) deleteDiv.remove();
                }
            }
        })
    })
}

export const postPoneTask = async (e) => {
    const selectedTasks = document.querySelectorAll(".single-task > input");
    const extendCal = document.querySelector(".postpone-dates");
    const timeStamp = e.target.getAttribute("value");

    selectedTasks.forEach(async (e) => {
        if (e.checked) {
            const res = await fetch(`/api/tasks/${e.dataset.task}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ deadline: `${timeStamp}` })
            })
            if (!res.ok) {
                console.log("Something went wrong");
            } else {
                console.log("it worked");
            }
            extendCal.style.display = 'none';
        }
    })
}

export const moveTask = async (e) => {
    const selectedTask = document.querySelectorAll(".single-task > input");
    const listMenu = document.querySelector('.list-of-lists');
    const listId = e.target.id;

    selectedTask.forEach(async (e) => {
        if (e.checked) {
            const res = await fetch(`/api/tasks/${e.dataset.task}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ listId: `${listId}` })
            })
            if (!res.ok) {
                console.log("Something went wrong");
            } else {
                console.log("it worked");
                const deleteDiv = document.querySelector(`[data-task="${e.dataset.task}"]`);
                deleteDiv.remove();
            }
            listMenu.style.display = 'none';
        }

    })
}

export const changeCategory = async (e) => {
    const selectedTasks = document.querySelectorAll(".single-task > input");
    const tag = document.querySelector(".category");
    const tagId = e.target.id;

    selectedTasks.forEach(async (e) => {
        if (e.checked) {
            const res = await fetch(`/api/tasks/${e.dataset.task}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ categoryId: `${tagId}` })
            })
            if (!res.ok) {
                console.log("Something went wrong");
            } else {
                console.log("it worked");
            }
            tag.style.display = 'none';
        }
    })


}

export const deleteTask = async (e) => {
    const trashTask = document.querySelector(".delete");

    trashTask.addEventListener('click', async (e) => {
        const selectedTasks = document.querySelectorAll(".single-task > input");
        selectedTasks.forEach(async (e) => {
            if (e.checked) {
                const res = await fetch(`/api/tasks/${e.dataset.task}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: null
                })
                if (!res.ok) {
                    console.log("Something went wrong")
                } else {
                    console.log("Task deleted")
                    const deleteDiv = document.querySelector(`[data-task="${e.dataset.task}"]`);
                    if (deleteDiv) deleteDiv.remove();
                }
            }
        })
    })
}

export const getDropMenu = (e) => {

    //console.log('click')
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
    const hr = document.createElement('hr');
    listMenu.appendChild(hr);
    const div = document.createElement('div');
    div.innerText = "Create new list";
    div.addEventListener("click", showCreateList);
    listMenu.appendChild(div);
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
        div.setAttribute("id", tag.id);
        div.addEventListener("click", changeCategory);
        categoryList.appendChild(div);
    });

    const hr = document.createElement('hr');
    categoryList.appendChild(hr);
    const div = document.createElement('div');
    div.innerText = "Create new tag";
    //div.addEventListener("click", stuff);
    categoryList.appendChild(div);
}


export const createDropDownMenu = () => {
    createListDropDown();
    createPostPoneList();
    createTagList();
}
