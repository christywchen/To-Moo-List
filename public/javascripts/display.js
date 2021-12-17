
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
    console.log("does it work")
    addListDiv.style.display = 'block';
    addListDiv.style.position = 'fixed';
}

export function hideListOptions(e) {
    const box = document.querySelector('.list-edit-dropdown')
    if (box) box.remove();
}

export function hideListNameDiv (e) {
    const addListDiv = document.querySelector('#add-list');
    const renameListDiv = document.querySelector('#rename-list')
    if (e.target.className !== 'logout') {
        if (((!addListDiv.contains(e.target) &&
            !renameListDiv.contains(e.target)) &&
            e.target.className !== 'add-list-button') ||
            e.target.className === 'submit-list' ||
            e.target.className === 'cancel-submit-list' ||
            e.target.className === 'close') {
            // e.preventDefault()
            addListDiv.style.display = 'none';
            renameListDiv.style.display = 'none';
            const form = document.getElementById('addList');
            form.value = '';
        }
    }
};

export function hideDropDown(e) {
    const listMenu = document.querySelector(".list-of-lists");
    const postponeMenu = document.querySelector(".postpone-dates");
    const categoryList = document.querySelector('.list-of-tags');
    if (e.target.className !== 'logout') {
        if (!listMenu.className.includes(e.target) &&
            !e.target.className.includes('grid-square') &&
            !e.target.className.includes('fas')) {
            //e.preventDefault()
            listMenu.style.display = 'none';
            postponeMenu.style.display = 'none';
            categoryList.style.display = 'none';
        }
    }
}
