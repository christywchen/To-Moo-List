import { clearDOMTasks, clearSearchRecs } from './clean-dom.js';
import { createSidebarContainer, buildTaskSummary, populateTasks, populateSearchBox, decorateList, buildListSelectOptions } from './create-dom-elements.js';
import { toggleListSelect, selectNewList } from './display.js';
import { initializePage } from './initialize-page.js';
import { addTaskSummaryEventListeners, taskId, moveTaskToNewList, moveTasktoNew } from './dashboard-summary.js';
import { updateTaskStatus } from './display-task-updates.js'

window.addEventListener("load", async (event) => {
    initializePage();
});

export let listId;

// C-R-U-D Functions
// C
export async function createTask(e) {
    e.preventDefault();
    const taskData = document.querySelector('#add-task-input');
    const taskContainer = document.getElementById("tasksContainer");
    const formData = new FormData(taskData);
    const name = formData.get('name');
    const body = { name, listId };
    const div = document.createElement('div');
    const input = document.getElementById('name');
    div.classList.add('single-task')

    if (input.value.length) {
        try {
            const res = await fetch(`/api/tasks`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" }
            })

            if (!res.ok) {
                console.error('-Unable to reach database-');
                if (!listId) alert('Please select a list for your new task')
                else alert('Uh-oh, there was a problem with the server.') // TODO
                throw res
            }
            else {
                const { task } = await res.json();

                populateTasks(task);

                const addTaskButton = document.querySelector('.add-task-button > button');
                addTaskButton.disabled = true;
                input.value = "";
                updateTaskStatus();
            }

        } catch (err) {

        }
    }
};

export async function createList(e) {
    const stateId = { id: "99" };

    const listForm = document.querySelector('#add-list-form');
    const listData = document.querySelector('#addList');
    const formData = new FormData(listForm);
    const name = formData.get('addList');
    const body = { name };
    const tasksList = document.getElementById('task-lists');

    if (listData.value.length) {
        try {
            const res = await fetch('/api/lists', {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (!res.ok) throw res
            else {
                const newList = await res.json();
                listId = newList.list.id;
                const div = createSidebarContainer(newList.list.name, 'list', listId);
                decorateList(div);
                clearDOMTasks();
                tasksList.appendChild(div);
                toggleListSelect(e, div);


                selectNewList();

                if (moveTasktoNew) {
                    await moveTaskToNewList(taskId, listId);
                    await fetchListTasks(e);
                    const taskRes = await fetch(`/api/lists/${listId}/tasks`);
                    const { tasks } = await taskRes.json();
                    populateTasks(tasks);
                }
                window.history.replaceState(stateId, `List ${listId}`, `/dashboard/#list/${listId}`);

            }
        } catch (error) {
            console.log(error)
        }
    }
};

// R
export async function fetchTaskSummary(e) {
    const stateId = { id: "99" };
    const listName = window.location.href.split('/')[4];
    const taskId = document.querySelector('input[type="checkbox"]:checked');
    if (!taskId) return

    const summaryRes = await fetch(`/api/tasks/${taskId.dataset.task}`);
    const { task } = await summaryRes.json();

    buildTaskSummary(task);
    addTaskSummaryEventListeners();
    if (listName !== '#list') {
        window.history.replaceState(stateId, `Task ${task.id}`, `/dashboard/${listName}/${task.listId}/tasks/${task.id}`);
    } else {
        window.history.replaceState(stateId, `Task ${task.id}`, `/dashboard/#list/${task.listId}/tasks/${task.id}`);
    }
};

export async function fetchListTasks(e) {
    e.stopPropagation();
    clearDOMTasks();
    const stateId = { id: "100" };
    const boxTarget = e.target.classList.contains('list-box');
    const listTarget = e.target.classList.contains('list-item')
    if (boxTarget || listTarget) {
        listId = e.target.dataset.listid;
        const taskRes = await fetch(`/api/lists/${listId}/tasks`);
        const { tasks } = await taskRes.json();
        populateTasks(tasks);
        window.history.replaceState(stateId, `List ${e.target.dataset.listid}`, `/dashboard/#list/${e.target.dataset.listid}`);
    }
};

export async function fetchInboxTasks(fetchPath) {
    listId = null;
    const taskRes = await fetch(fetchPath);
    const { tasks } = await taskRes.json();

    if (fetchPath.split('/')[3] === 'completed') {
        populateTasks(tasks, 'getCompleted')
    } else populateTasks(tasks);

};

export async function fetchPriorityTasks(e) {
    e.stopPropagation();
    clearDOMTasks();
    const stateId = { id: "101" };
    listId = null;
    const priorityId = e.target.dataset.priorityid

    if (priorityId) {
        const res = await fetch(`/api/priorities/${priorityId}`);
        const { tasks } = await res.json();
        populateTasks(tasks);
        window.history.replaceState(stateId, `Priority ${priorityId}`, `/dashboard/#priority/${priorityId}`);
    }
};

export async function fetchSearch(e) {
    const searchForm = document.getElementById('search-form');
    const searchData = new FormData(searchForm);
    const name = searchData.get('search');
    const stateId = { id: "103" };
    const searchStr = encodeURIComponent(name)
    if (name.length) {
        const res = await fetch(`/api/search/tasks/${name}`);
        const { tasks } = await res.json();
        if (!res.ok) throw res
        else {
            if (e.target.classList.contains('search-button') ||
                e.target.classList.contains('fa-search')) {
                // clearDOMTasks()
                populateTasks(tasks);
                window.history.replaceState(stateId, `Search ${name}`, `/dashboard/search/?q=${searchStr}`);
            } else {
                populateSearchBox(tasks.slice(0, 5))
            }
        }
    }
};

// U
export function updateListId(e) {
    listId = e.target.dataset.listid;
};

export const renameList = async (e) => {
    e.preventDefault();
    const listForm = document.querySelector('#rename-list-form');
    const listData = document.querySelector('#renameList');
    const formData = new FormData(listForm);
    const name = formData.get('renameList');
    const body = { name };

    if (name.length) {
        try {
            const res = await fetch(`/api/lists/${listId}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            if (!res.ok) throw res
            else console.log('List renamed')

            const list = document.querySelector(`[data-listid="${listId}"]`)
            list.children[0].innerText = name;

            // if task summary panel is showing
            // update the list selection so that current list reflect the new name
            const taskDetailsDiv = document.querySelector('#task-details');
            if (taskDetailsDiv.classList.contains('task-details-display')) {
                const summaryListSelect = document.querySelector('#summary-list-select');
                while (summaryListSelect.hasChildNodes()) {
                    summaryListSelect.removeChild(summaryListSelect.lastChild);
                }

                await buildListSelectOptions(listId, name);
            }
        } catch (error) {
        }
    }
};

export async function updateList(e) {
    const list = e.target
        .parentNode.parentNode
        .querySelector('.list-item')
    const listId = list.dataset.listid;

    const res = await fetch(`/api/lists/${listId}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
    })
};

// D
export async function deleteList(e) {
    e.stopPropagation()
    const list = e.target
        .parentNode.parentNode
        .querySelector('.list-item')
    const listId = list.dataset.listid;

    const res = await fetch(`/api/lists/${listId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
    })

    if (!res.ok) {
        console.log('Something went wrong')
    } else {
        console.log('List deleted')
        list.parentNode.remove();
        clearDOMTasks();
    }
};
