import { createTask, createList, renameList, fetchSearch, fetchListTasks, fetchCategoryTasks } from './dashboard.js'
import { hideTaskButton, hideListNameDiv, hideListOptions, hideDropDown, showTaskButton, showCreateList, toggleListDisplay, toggleListSelect } from './display.js';
import { createSidebarContainer } from './create-dom-elements.js';
import { createDropDownMenu } from './dashboard-tasks.js';
import { updateTaskStatus } from './dashboard-recap.js';

export const initializePage = async () => {
    const listRes = await fetch('/api/lists')
    const { lists } = await listRes.json();
    const taskList = document.getElementById('task-lists');
    const categoryRes = await fetch('/api/categories');
    const { categories } = await categoryRes.json();
    const categoryList = document.getElementById('task-categories');
    const headers = document.querySelectorAll('.list-header-container');
    const inboxLists = document.querySelectorAll('.inbox-list');

    headers.forEach(header => {
        header.addEventListener('click', (e) => {
            const lists = header.nextElementSibling;
            toggleListDisplay(lists);
        });
    });

    inboxLists.forEach(list => {
        list.addEventListener('click', toggleListSelect);
    })

    lists.forEach(list => {
        const div = createSidebarContainer(list.name, 'list', list.id);
        div.addEventListener('click', (e) => {
            fetchListTasks(e);
            toggleListSelect(e)
        });
        taskList.appendChild(div);
    });
    categories.forEach(category => {
        const div = createSidebarContainer(category.name, 'category', category.id);
        div.addEventListener('click', (e) => {
            fetchCategoryTasks(e);
            toggleListSelect(e);
        })
        categoryList.appendChild(div);
    })

    const buttons = document.querySelectorAll('button')
    buttons.forEach(button => {
        if (button.className !== 'logout') {
            button.addEventListener('click', e => e.preventDefault())
        }
    });

    const addTaskFormDiv = document.querySelector('#add-task-form');
    const addTaskButtonDiv = document.querySelector('.add-task-button');
    const addListDiv = document.querySelector('#add-list');
    const addTaskInp = document.querySelector('input#name.inp-field');
    const addTaskButton = document.querySelector('.add-task-button button');
    const addListButtonL = document.querySelector('.add-list-button-l');
    const submitListButton = document.querySelector('.submit-list');
    const closeListSubmission = document.querySelector('.close');
    const renameListButton = document.querySelector('.rename-list');
    const searchButton = document.querySelector('.search-button');
    const searchField = document.querySelector('#search');

    addTaskButton.addEventListener('click', createTask);
    document.addEventListener('click', hideTaskButton);
    document.addEventListener('click', hideListNameDiv);
    document.addEventListener('click', hideListOptions);
    //document.addEventListener('click', hideCreateTaskDiv);
    document.addEventListener('click', hideDropDown);
    addTaskInp.addEventListener('keyup', showTaskButton);
    addListButtonL.addEventListener('click', showCreateList);
    submitListButton.addEventListener('click', createList);
    submitListButton.addEventListener('click', hideListNameDiv);
    closeListSubmission.addEventListener('click', hideListNameDiv);
    renameListButton.addEventListener('click', renameList);
    searchButton.addEventListener('click', fetchSearch);
    searchField.addEventListener('keyup', fetchSearch);

    createDropDownMenu();
    updateTaskStatus();
};
