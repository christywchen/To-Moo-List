
// Fade background
export function fadeBackground(e) {
    const isFaded = document.querySelector('.page-cover')
    if (!isFaded) {
        const body = document.body;
        const div = document.createElement('div');
        div.classList.add('page-cover');
        removeSelfOnClick(div);
        showPageListeners();
        body.prepend(div);
    }
};

export function showPageListeners() {
    const buttons = document.querySelectorAll('button');
    const exitWindow = document.querySelector('.close');
    exitWindow.addEventListener('click', (e) => {
        hideContainer('page-cover');
    })
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            hideContainer('page-cover');
        })
    })
}

function removeSelfOnClick(container) {
    const className = container.className;
    console.log(className);
    container.addEventListener('click', (e) => {
        hideContainer(className)
    })
}


// Create / Rename List forms
export async function showCreateList(e) {
    const addListDiv = document.querySelector('#add-list');
    // e.preventDefault();
    addListDiv.style.display = 'block';
    addListDiv.style.position = 'fixed';
    fadeBackground();
}

export async function showRenameList(e) {
    // e.preventDefault();
    const renameListDiv = document.querySelector('#rename-list');
    renameListDiv.style.display = 'block';
    renameListDiv.style.position = 'fixed';
    fadeBackground()
}

// hide list options
export function hideListOptions(e) {
    const box = document.querySelector('.list-edit-dropdown')
    if (box) {
        box.remove();
    }
}

// Show / Hide Task Button
export function showTaskButton(e) {
    const addTaskInp = document.querySelector('input#name.inp-field');
    const addTaskButton = document.querySelector('.add-task-button > button');
    e.preventDefault()
    if (addTaskInp.value) {
        addTaskButton.disabled = false;
    }
    else addTaskButton.disabled = true;
};

export const hideTaskButton = (e) => {
    const addTaskFormDiv = document.querySelector('#add-task-form');
    const addTaskButtonDiv = document.querySelector('.add-task-button');
    if (addTaskFormDiv.contains(e.target)) {
        e.preventDefault()
        addTaskButtonDiv.classList.add('add-task-button-transition');
    }
    else addTaskButtonDiv.classList.remove('add-task-button-transition');
};

// Hide Add / Rename form
export function hideListNameDiv(e) {
    const addListDiv = document.querySelector('#add-list');
    const renameListDiv = document.querySelector('#rename-list');

    if (e.target.className !== 'logout') {
        if (((!addListDiv.contains(e.target) &&
            !renameListDiv.contains(e.target)) &&
            !e.target.classList.contains('far')) ||
            e.target.className === 'submit-list' ||
            e.target.className === 'cancel-submit-list' ||
            e.target.className === 'close' ||
            e.target.className === 'rename-list') {
            addListDiv.style.display = 'none';
            renameListDiv.style.display = 'none';
            const form = document.getElementById('addList');
            form.value = '';
        }
    }

    // find all select box classes and remove them.
};

export function hideDropDown(e) {
    const listMenu = document.querySelector(".list-of-lists");
    const postponeMenu = document.querySelector(".postpone-dates");
    const categoryList = document.querySelector('.list-of-tags');
    const listContainers = document.querySelectorAll('.list-container');
    const searchRecs = document.querySelector('.search-recommendations');

    if (e.target.className !== 'logout') {
        if (!listMenu.className.includes(e.target) &&
            !e.target.className.includes('grid-square') &&
            !e.target.className.includes('list-header') &&
            !e.target.className.includes('add-tag-input') &&
            !e.target.className.includes('fas')) {
            //e.preventDefault()
            listMenu.style.display = 'none';
            postponeMenu.style.display = 'none';
            categoryList.style.display = 'none';
            searchRecs.style.display = 'none';
        }
    }
};

// Toggles
export async function toggleListSelect(e) {
    const prevSelected = document.querySelector('.selected-list');
    let list = e.target
    // Lists and Categories have an extra div container.
    if (list.classList.contains('sidebar-box')) {
        list = list.children[0];
    }
    if (prevSelected) await deselectList()
    await selectList(list)

};

export function toggleListDisplay(container) {
    const icon = container.parentNode.querySelector('.fas');
    const isSelected = container.style.display === 'block';

    if (isSelected) {
        container.style.display = 'none';
        icon.classList.remove('fa-caret-down');
        icon.classList.add('fa-caret-right');
    } else {
        container.style.display = 'block';
        icon.classList.remove('fa-caret-right');
        icon.classList.add('fa-caret-down');
    }
};

// Promises
function selectList(list) {
    return new Promise((res, rej) => {
        list.classList.add('selected-list')
        res();
    })
};

export function deselectList() {
    return new Promise((res, rej) => {
        const selected = document.querySelector('.selected-list');
        if (selected) {
            selected.classList.remove('selected-list');
        }
        res();
    })
}


export function showContainer(container, showFn) {
    return new Promise(function (res, rej) {
        const newContainer = showFn()
        container.appendChild(newContainer)
        res()
    })
};

// hide DOM container
export function hideContainer(className) {
    return new Promise(function (res, rej) {
        hideDuplicateBox(className);
        res()
    })
};


// remove container from DOM
export async function hideDuplicateBox(className) {
    const box = document.querySelector(`.${className}`);
    if (box) {
        box.remove();
    }
};

export function hideDivContainer() {

    const visibleDiv = document.querySelector('.visible');
    //console.log(visibleDiv);
    if (visibleDiv) {
        visibleDiv.style.display = 'none';
        visibleDiv.classList.remove('visible');
    };

};

// toggle highlight on task creation
