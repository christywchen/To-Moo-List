import { fetchListTasks, updateListId } from './dashboard-list.js';
import { clearDOMTasks } from './clean-dom.js';
import { deleteList, updateList } from './dashboard-list.js';
import { showRenameList, showCreateList } from './display.js';

export function createListDiv(name, listId) {
    const container = document.createElement('div');
    const listDiv = document.createElement('div');
    container.className = 'list-box';
    container.style.position = 'relative';

    listDiv.innerText = name;
    listDiv.setAttribute('data-listId', `${listId}`);
    listDiv.className = 'list-item';

    const iconsBox = document.createElement('div');
    iconsBox.className = 'list-icons';
    const editIcon = document.createElement('div');
    editIcon.innerText = 'v'
    editIcon.setAttribute('data-listId', `${listId}`);
    // TO DO add image to icon box
    // make invisible edit icon

    container.appendChild(listDiv);
    container.appendChild(iconsBox);
    iconsBox.appendChild(editIcon);
    editIcon.addEventListener('click', (e) => {
        container.appendChild(listEditDropDown())
    });
    editIcon.addEventListener('click', updateListId);
    container.addEventListener('click', fetchListTasks);
    // container.appendChild(listEditDropDown());
    return container
}

export function createTaskHtml(taskName, taskId) {
    return ` <input type="checkbox" data-task="${taskId}" name="${taskName}" value="${taskName}">
                <label for="${taskName}" data-task="${taskId}">${taskName}</label>
                <div hidden class='categories'>mwhahahah</div>`;
};

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
    renameListOp.addEventListener('click', showRenameList)
    deleteListOp.addEventListener('click', deleteList);

    return container;
}
