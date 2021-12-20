import { updateList } from './dashboard.js';
import { showCreateList, hideDivContainer } from './display.js'

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
                    completeTask.style.animation = "fetchSuccess 1s";
                    const deleteDiv = document.querySelector(`[data-task="${e.dataset.task}"]`);
                    if (deleteDiv) deleteDiv.remove();
                    //setTimeout(() => window.alert("Your task was completed!"));
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
    const tag = document.querySelector(".list-of-tags");
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

export function deleteTask(e) {
    
    const trashTask = document.querySelector(".delete");

    trashTask.addEventListener('click', (e) => {
        const selectedTasks = document.querySelectorAll(".single-task > input");
        selectedTasks.forEach(async (ev) => {
            if (ev.checked) {
                const res = await fetch(`/api/tasks/${ev.dataset.task}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: null
                })
                if (!res.ok) {
                    console.log("Something went wrong")
                } else {
                    const deleteDiv = document.querySelector(`[data-task="${ev.dataset.task}"]`);
                    if (deleteDiv) deleteDiv.remove();
                    //setTimeout( () => window.alert("Your task was deleted"))
                }
            }
        })
        trashTask.style.animation = "fetchSuccess 1s";
    })
}

export const getDropMenu = (e) => {

    //console.log('click')
    const listMenu = document.querySelector('.list-of-lists');
    const moveCal = document.querySelector('.moveTo');
    moveCal.addEventListener('click', (e) => {
        hideDivContainer()
        listMenu.style.display = 'block';
        listMenu.style.animation = "growDown .5s ease";
        listMenu.classList.add('visible');
    })

    const postponeList = document.querySelector('.postpone-dates');
    const helpCal = document.querySelector('.postpone');
    helpCal.addEventListener('click', (e) => {
        hideDivContainer()
        postponeList.style.display = 'block';
        postponeList.style.animation = "growDown .5s ease";
        postponeList.classList.add('visible');
    })

    // const alert = document.querySelector(".alert");
    // alert.addEventListener('click', (e) => {
    //     window.alert("MOOOOOOOOO")
    // })

    const categoryList = document.querySelector('.list-of-tags');
    const tag = document.querySelector('.category');
    tag.addEventListener('click', (e) => {
        hideDivContainer()
        categoryList.style.display = 'block';
        categoryList.style.animation = "growDown .5s ease";
        categoryList.classList.add('visible');
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
    const input = document.createElement('input');
    input.classList = 'add-tag-input'
    input.placeholder = "type new list & enter";
    input.type="text";
    input.addEventListener("keypress", async (e) => {
        if (e.key === 'Enter') {
            const res = await fetch('/api/lists', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: `${e.target.value}`})
            })
            const menuDiv = document.querySelector('.moveTo')
            if (!res.ok) {
                menuDiv.style.animation = "fetchFail 1s";
                listMenu.style.animation = "fetchFail 1s";
                window.alert("Could not add a new list");
                throw res
            }
            e.target.value = "";
            menuDiv.style.animation = "fetchSuccess 1s";
            hideDivContainer();
        }
    });
    listMenu.appendChild(input);
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
    const input = document.createElement('input');
    input.classList = 'add-tag-input'
    input.placeholder = "enter new category & enter";
    input.type="text";
    input.addEventListener("keypress", async (e) => {
        if (e.key === 'Enter') {
            const res = await fetch('/api/categories', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: `${e.target.value}`})
            })
            const categoryDiv = document.querySelector('.category')
            if (!res.ok) {
                categoryDiv.style.animation = "fetchFail 1s";
                categoryList.style.animation = "fetchFail 1s";
                window.alert("Could not add a new category");
                throw res
            }
            categoryDiv.style.animation = "fetchSuccess 1s";
            e.target.value = "";
            hideDivContainer();
        }
    });
    categoryList.appendChild(input);
}

export const createDropDownMenu = () => {
    createListDropDown();
    createPostPoneList();
    createTagList();
}
