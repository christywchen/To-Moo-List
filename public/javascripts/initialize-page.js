import { createTask, createList, renameList, fetchSearch, fetchPriorityTasks, fetchInboxTasks } from './dashboard.js'
import { hideTaskButton, fadeBackground, hideListNameDiv, hideListOptions, hideDropDown, showTaskButton, showCreateList, toggleListDisplay, toggleListSelect, selectList, deselectList, selectSearchField } from './display.js';
import { createSidebarContainer, decorateList } from './create-dom-elements.js';
import { createDropDownMenu, checkAllBoxes, finishTask, deleteTask, createPostPoneList } from './dashboard-tasks.js';
import { updateTaskStatus } from './display-task-updates.js';
import { clearSearch } from './clean-dom.js';
import { todayTasksRoute } from './dashboard-inbox.js';

export const initializePage = async () => {
    const stateId = { id: "98" };
    window.history.replaceState(stateId, `Dashboard`, `/dashboard`);

    const listRes = await fetch('/api/lists')
    const { lists } = await listRes.json();
    const taskList = document.getElementById('task-lists');
    const priorityRes = await fetch('/api/priorities');
    const { priorities } = await priorityRes.json();
    const priorityList = document.getElementById('task-priorities');
    const headers = document.querySelectorAll('.list-header-container');
    const inboxLists = document.querySelectorAll('.inbox-list');
    const buttons = document.querySelectorAll('button');
    const todaysList = document.getElementById('today');
    const inboxHeader = document.getElementById('default-lists');


    if (!lists.length) showCreateList()
    else {
        fetchInboxTasks(todayTasksRoute);
        toggleListDisplay(inboxHeader);
        selectList(todaysList);

        const stateId = { id: "99" };
        window.history.replaceState(stateId, `Today`, `/dashboard/#today`);
    }

    headers.forEach(header => {
        header.addEventListener('click', (e) => {
            const lists = header.nextElementSibling;
            toggleListDisplay(lists, e);
        });
    });

    inboxLists.forEach(list => {
        list.addEventListener('click', toggleListSelect);
    })

    lists.forEach(list => {
        const div = createSidebarContainer(list.name, 'list', list.id);
        decorateList(div);
        taskList.appendChild(div);
    });
    priorities.forEach((priority, i) => {
        if (i === 3) return
        const div = createSidebarContainer(priority.name, 'priority', priority.id);
        decorateList(div);
        div.addEventListener('click', fetchPriorityTasks);
        priorityList.appendChild(div);
    })

    buttons.forEach(button => {
        if (button.className !== 'logout') {
            button.addEventListener('click', e => e.preventDefault())
        }
    });

    const addTaskFormDiv = document.querySelector('#add-task-form');
    const addTaskButtonDiv = document.querySelector('.add-task-button');
    const addListDiv = document.querySelector('#add-list');
    const addListButton = document.querySelector('.fa-plus-square');
    const addTaskInp = document.querySelector('input#name.inp-field');
    const addTaskButton = document.querySelector('.add-task-button button');
    const addListButtonL = document.querySelector('.fa-plus-square');
    const submitListButton = document.querySelector('.submit-list');
    const closeListSubmission = document.querySelector('.close');
    const renameListButton = document.querySelector('.rename-list');
    const searchButton = document.querySelector('.search-button');
    const searchField = document.querySelector('#search');
    const checkBox = document.querySelector('.checkbox-all');
    const completeTask = document.querySelector('.completed');
    const postpone = document.querySelector('.postpone');
    const trashTask = document.querySelector('.delete');
    const searchIcon = document.querySelector('.fa-search');

    document.addEventListener('click', (e) => {
        hideTaskButton(e);
        hideListNameDiv(e);
        hideListOptions(e);
        hideDropDown(e);
        clearSearch(e);
    });

    addTaskButton.addEventListener('click', createTask);
    addTaskInp.addEventListener('keyup', showTaskButton);
    addListButtonL.addEventListener('click', showCreateList);
    submitListButton.addEventListener('click', (e) => {
        createList(e);
        hideListNameDiv(e);
    });

    postpone.addEventListener('click', createPostPoneList);

    closeListSubmission.addEventListener('click', hideListNameDiv);

    searchField.addEventListener('click', selectSearchField)
    searchField.addEventListener('keyup', fetchSearch);

    searchIcon.addEventListener('click', (e) => {
        fetchSearch(e);
        deselectList();

    })
    searchButton.addEventListener('click', (e) => {
        fetchSearch(e);
        deselectList();
    });
    addListButton.addEventListener('click', fadeBackground)
    renameListButton.addEventListener('click', (e) => {
        renameList(e);
    });
    checkBox.addEventListener("click", checkAllBoxes);
    completeTask.addEventListener("click", finishTask);
    trashTask.addEventListener("click", deleteTask);

    createDropDownMenu();
    updateTaskStatus();

};
