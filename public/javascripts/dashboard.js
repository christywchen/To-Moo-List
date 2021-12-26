import { finishTask, postPoneTask, changeTag, moveTask, getDropMenu, createDropDownMenu } from './dashboard-tasks.js';
import { addTaskSummaryEventListeners } from './dashboard-summary.js';
import { clearDOMTasks, clearSearchRecs } from './clean-dom.js';
import { createSidebarContainer, buildTaskSummary, createTaskHtml, populateTasks, populateSearchBox, decorateList, buildListSelectOptions } from './create-dom-elements.js';
import { selectList, toggleListDisplay, showTaskButton, hideTaskButton, showCreateList, hideListOptions, hideListNameDiv, hideDropDown, toggleListSelect, selectNewList } from './display.js';
import { updateTaskStatus } from './dashboard-recap.js';
import { initializePage } from './initialize-page.js';

window.addEventListener("load", async (event) => {
    initializePage();
});

export let listId;

// C-R-U-D Functions
// C

//createTask is create a new task in the middle part of the page
export async function createTask(e) {
    e.preventDefault();
    const taskData = document.querySelector('#add-task-input');
    //'#add-task-input' exist in the box of input task in the main part

    const taskContainer = document.getElementById("tasksContainer");
    //a box to show the lists of tasks below the input box

    const formData = new FormData(taskData);
    //create a new formdata with key/value pairs
    const name = formData.get('name');
    const body = { name, listId };
    const div = document.createElement('div');
    const input = document.getElementById('name');
    div.classList.add('single-task')
    //
    if (input.value.length) {
        try {
            const res = await fetch(`/api/lists/${listId}`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" }
            })

            if (!res.ok) {
                console.error('-Unable to reach database-');
                if (!listId) alert('Please select a list for your new task')
                else alert('Opps there was a problem with the server') // TODO
                throw res // May need to change this
            }
            else {
                const { task } = await res.json();

                populateTasks(task);
                //populateTasks is decorate all tasks and add them into the tasksContainer.

                const addTaskButton = document.querySelector('.add-task-button > button');
                addTaskButton.disabled = true;
                input.value = "";
                //These three lines makes the input a empty string, and disabled the button.
            }
        } catch (err) {
            // TODO finish error handling
        }
    }
};

//Create a new list is implemented by pop up a form
export async function createList(e) {
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
                const newList = await res.json()
                // const listId = newList.list.id;
                listId = newList.list.id;
                const div = createSidebarContainer(newList.list.name, 'list', listId);
                decorateList(div); 
                //decorate the list in css format

                clearDOMTasks();
                //clear the tasks which are left from previous list

                tasksList.appendChild(div);
                toggleListSelect(e, div);
                //deal with how to invoke the task summary


                selectNewList()
                //create a new list display format

                // const select = document.querySelector(‘#summary-list-select’);
                // select.innerHTML = ‘’;

                // buildListSelectOptions(listId, list.name)
            }
        } catch (error) {

        }
    }
};

// Create Categroy Function?

// R
export async function fetchTaskSummary(e) {
    // highlightTask(e);
    const stateId = { id: "99" };
    const listName = window.location.href.split('/')[4];
    const summaryRes = await fetch(`/api/tasks/${e.target.dataset.task}`);
    const { task } = await summaryRes.json();

    const currentTask = task.name;
    const currentTaskId = task.id;
    const currentDeadline = task.deadline;
    const currentListId = task.listId;
    const currentList = task.List.name;
    const currentDesc = task.description;
    const currentPriorityId = task.categoryId;
    const currentPriority = task.Category.name;

    buildTaskSummary(task);
    //create task summary
    addTaskSummaryEventListeners();
    if (listName !== '#list') {
        window.history.replaceState(stateId, `Task ${task.id}`, `/dashboard/${listName}/${task.listId}/tasks/${task.id}`);
        //history.replaceState():modifies the current history entry, replacing it with the stateObj, title, 
        //and URL passed in the method parameters.This method is particularly useful when you want to update 
        //the state object or URL of the current history entry in response to some user action.
    } else {
        window.history.replaceState(stateId, `Task ${task.id}`, `/dashboard/#list/${task.listId}/tasks/${task.id}`);
    }
};

// TO DO: make update url function?

export async function fetchListTasks(e) {
    e.stopPropagation();
    clearDOMTasks();
    const stateId = { id: "100" };
    const boxTarget = e.target.classList.contains('list-box');
    const listTarget = e.target.classList.contains('list-item')
    if (boxTarget || listTarget) {
        listId = e.target.dataset.listid;
        const taskRes = await fetch(`/api/lists/${listId}/tasks`);
        // TO DO: filter by completed.
        // api/tasks/compelted --
        const { tasks } = await taskRes.json();
        populateTasks(tasks);
        window.history.replaceState(stateId, `List ${e.target.dataset.listid}`, `/dashboard/#list/${e.target.dataset.listid}`);
    }
};

export async function fetchInboxTasks(fetchPath) {
    listId = null;
    const taskRes = await fetch(fetchPath);
    const { tasks } = await taskRes.json();
    // TO DO: Needs Error Handling

    if (fetchPath.split('/')[3] === 'completed') {
        populateTasks(tasks, 'getCompleted')
    } else populateTasks(tasks);


};

export async function fetchCategoryTasks(e) {
    e.stopPropagation();
    clearDOMTasks();
    const stateId = { id: "101" };
    listId = null;
    const categoryId = e.target.dataset.categoryid

    if (categoryId) {
        const res = await fetch(`/api/categories/${categoryId}`);
        const { tasks } = await res.json();
        // TO DO: Error Handling
        populateTasks(tasks);
        window.history.replaceState(stateId, `Priority ${categoryId}`, `/dashboard/#priority/${categoryId}`);
    }
};

export async function fetchSearch(e) {
    const searchForm = document.getElementById('search-form');
    const searchData = new FormData(searchForm);
    const name = searchData.get('search');
    const stateId = { id: "103" };
    clearSearchRecs()
    const searchStr = encodeURIComponent(name)
    if (name.length) {
        const res = await fetch(`/api/search/tasks/${name}`);
        const { tasks } = await res.json();
        // const searchStr = name.replace(/\'/g, '%27');
        // TO DO: Error handling
        if (!res.ok) throw res
        else {
            if (e.target.classList.contains('search-button') ||
                e.target.classList.contains('fa-search')) {
                clearDOMTasks()
                populateTasks(tasks);
                window.history.replaceState(stateId, `Search ${name}`, `/dashboard/search/?q=${searchStr}`);
            } else {
                populateSearchBox(tasks/*.slice(0, 5)*/)
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
        // -- DOM removal isn't working
        console.log('List deleted')
        list.parentNode.remove();
        clearDOMTasks();
    }
};
