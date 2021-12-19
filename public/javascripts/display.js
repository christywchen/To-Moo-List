window.addEventListener("load", async (event) => {


})


export async function showRenameList(e) {
    // e.preventDefault();
    const renameListDiv = document.querySelector('#rename-list');
    renameListDiv.style.display = 'block';
    renameListDiv.style.position = 'fixed';
}

export function showTaskButton(e) {
    const addTaskInp = document.querySelector('input#name.inp-field');
    const addTaskButton = document.querySelector('.add-task-button button');
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

export async function showCreateList(e) {
    const addListDiv = document.querySelector('#add-list');
    // e.preventDefault();
    addListDiv.style.display = 'block';
    addListDiv.style.position = 'fixed';
}

export function hideListOptions(e) {
    const box = document.querySelector('.list-edit-dropdown')
    if (box) {
        box.remove();
    }
}

export async function hideDuplicateBox(className) {
    const box = document.querySelector(`.${className}`);
    if (box) {
        box.remove();
    }
}

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
    if (e.target.className !== 'logout') {
        if (!listMenu.className.includes(e.target) &&
            !e.target.className.includes('grid-square') &&
            !e.target.className.includes('fas') &&
            !e.target.className.includes('add-tag-input')) {
            //e.preventDefault()
            listMenu.style.display = 'none';
            postponeMenu.style.display = 'none';
            categoryList.style.display = 'none';
        }
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

// Promises

export function showContainer(container, showFn) {
    return new Promise(function (res, rej) {
        const newContainer = showFn()
        container.appendChild(newContainer)
        res()
    })
};

export function hideContainer(className) {
    return new Promise(function (res, rej) {
        hideDuplicateBox(className);
        res()
    })
};
