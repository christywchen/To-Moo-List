import { fetchListTasks } from './dashboard-list.js';
// import { deleteTask } from './dashboard-tasks.js';


export function createListDiv(name, className) {
    const container = document.createElement('div');
    const listDiv = document.createElement('div');
    container.className = 'list-box';
    listDiv.innerText = name;
    listDiv.className = className;
    const iconsBox = document.createElement('div');
    iconsBox.className = 'list-icons';
    const editIcon = document.createElement('div');
    editIcon.innerText = 'v'
    // TO DO add image to icon box
    // make invisible edit icon

    container.style.position = 'relative';

    iconsBox.appendChild(editIcon);
    container.appendChild(listDiv);
    container.appendChild(iconsBox);
    editIcon.addEventListener('click', (e) => {
        container.appendChild(listEditDropDown())
    });
    container.addEventListener('click', fetchListTasks);
    // container.appendChild(listEditDropDown());
    return container
}

// TO DO move all custom event listener funcitons into separate file


export function listEditDropDown() {
    const container = document.createElement('div');
    const renameListOp = document.createElement('div');
    const deleteListOp = document.createElement('div');
    renameListOp.innerText = 'Rename list';
    deleteListOp.innerText = 'Delete list';

    container.className = 'list-edit-dropdown'
    container.style.position = 'absolute';
    container.style.border = '1px red solid';

    [renameListOp, deleteListOp].forEach(option => {
        option.className = 'list-edit-option';
        container.appendChild(option);
    })
    // deleteListOp.addEventListener('click', deleteTask);

    return container;
    // e.target.appendChild(container);
}


async function deleteList(e) {
    const test = e.target.closest('')
}
