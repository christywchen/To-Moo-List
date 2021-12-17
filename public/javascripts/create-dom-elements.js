import { fetchListTasks, showCreateList, updateListId } from './dashboard-list.js';
import { clearDOMTasks } from './clean-dom.js';


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
    renameListOp.addEventListener('click', showRenameList)
    deleteListOp.addEventListener('click', deleteList);

    return container;
    // e.target.appendChild(container);
}


async function deleteList (e) {
    console.log(e.target.parentNode.parentNode)
    e.stopPropagation()
    const list = e.target
        .parentNode.parentNode
        .querySelector('.list-item')
    console.log(list.dataset.listid)
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
        list.remove();
        clearDOMTasks();
    }
}


async function updateList (e) {
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
}


const renameListDiv = document.querySelector('#rename-list');

export async function showRenameList(e) {
    // e.preventDefault();
    renameListDiv.style.display = 'block';
    renameListDiv.style.position = 'fixed';
}




// div.setAttribute('data-task', `${task.id}`);
/// data-listId // e.target.dataset.listId
// document.querySelector(`[data-task="${taskId}"]`);
