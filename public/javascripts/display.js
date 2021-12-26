
// Fade background
export function fadeBackground(e) {
    const isFaded = document.querySelector('.page-cover')
    if (!isFaded) {
        const body = document.body;
        const div = document.createElement('div');
        div.classList.add('page-cover');
        removeSelfOnClick(div);
        //remove a class after clicking
        showPageListeners();
        //hide the page-cover container after clicking
        body.prepend(div);
        //insert a new node before the first child of the element
    }
};

//showPageListeners is to hide the page-cover container after clicking
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

//removeSelfOnClick is to remove a class after clicking
function removeSelfOnClick(container) {
    const className = container.className;
    container.addEventListener('click', (e) => {
        hideContainer(className)
    })
}

// Create / Rename List forms
export async function showCreateList(e) {
    const addListDiv = document.querySelector('#add-list');
    // e.preventDefault();
    // const targetNotIcon = !e.target.classList.contains('far');
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
    if (!e.target.classList.contains('far')) {
        const box = document.querySelector('.list-edit-dropdown')
        if (box) {
            box.remove();
        }
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
            !e.target.id === 'summary-list-select' &&
            !e.target.classList.contains('list-edit-option') &&
            !e.target.classList.contains('far')) ||
            e.target.className === 'submit-list' ||
            e.target.className === 'cancel-submit-list' ||
            e.target.classList.contains('close') ||
            e.target.className === 'rename-list') {
            addListDiv.style.display = 'none';
            renameListDiv.style.display = 'none';
            const nameForm = document.getElementById('addList');
            const renameForm = document.getElementById('renameList');

            nameForm.value = '';
            renameForm.value = '';
            hideContainer('page-cover');
        }
    }

    // find all select box classes and remove them.
};

export function hideDropDown(e) {
    const listMenu = document.querySelector(".list-of-lists");
    const postponeMenu = document.querySelector(".postpone-dates");
    const categoryList = document.querySelector('.list-of-tags');
    const calDiv = document.querySelector('.hidden-cal')
    //const listContainers = document.querySelectorAll('.list-container');
    const searchRecs = document.querySelector('.search-recommendations');

    if (e.target.className !== 'logout') {
        if (!listMenu.className.includes(e.target) &&
            !e.target.className.includes('grid-square') &&
            !e.target.className.includes('list-header') &&
            !e.target.className.includes('add-tag-input') &&
            !e.target.className.includes('fas') &&
            !e.target.className.includes('search')) {
            //e.preventDefault()
            listMenu.style.display = 'none';
            postponeMenu.style.display = 'none';
            categoryList.style.display = 'none';
            searchRecs.style.display = 'none';
            calDiv.style.display = 'none';

            deselectSearchField()
        }
    }
};

export function selectSearchField(e) {
    const searchField = document.querySelector('.search')
    const searchIcon = document.querySelector('.fa-search');
    searchField.classList.add('search-selected');
    searchField.placeholder = 'Search task';
    searchIcon.classList.add('search-selected');
}

export function deselectSearchField(e) {
    const searchField = document.querySelector('.search');
    const searchIcon = document.querySelector('.fa-search');
    searchIcon.classList.remove('search-selected');
    searchField.classList.remove('search-selected');
    searchField.placeholder = '';
}

// Toggles
//toggleListSelect is dealing with the appearance of the task summary.
//When it selected, it will invoke the task summary; when it is not
//selected, it will remove the class which will invoke the task summary.
export async function toggleListSelect(e, listDiv) {
    const prevSelected = document.querySelector('.selected-list');
    let list = e.target
    if (listDiv) list = listDiv;
    // Lists and Categories have an extra div container.

    if (list.classList.contains('sidebar-box')) {
        list = list.children[0];
    }
    if (prevSelected) {
        if (list.dataset.listid) {
            // hide task summary if user switches to another task
            const taskSummaryDiv = document.querySelector('#task-details');
            taskSummaryDiv.classList.remove('task-details-display');
        }
        await deselectList()
    }
    await selectList(list)

};

//toggleListDisplay happens when click on the side-bar icon.
// when it has "+" button, return; when it displays in block,such as
//"Groceries" and "Fun Stuff", remove that displaying new things below
//the icon, add that displaying new things on the right.
export function toggleListDisplay(container, e) {
    const icon = container.parentNode.querySelector('.fas');
    //'.fas' exists in search, Inbox,Lists, Priority, add a list, rename a list

    const isSelected = container.style.display === 'block';
    if (e && e.target.classList.contains('fa-plus-square')) return
    //"fa-plus-square" exists in Lists, for "+" button

    if (isSelected) {
        // isSelected is for "Groceries" and "Fun Stuff"
        container.style.display = 'none';
        icon.classList.remove('fa-caret-down');
        //'fa-caret-down' means displaying below the icon.
        icon.classList.add('fa-caret-right');
        //'fa-caret-right' exists in Inbox.It means displaying on the right side
    } else {
        //else is for Lists
        container.style.display = 'block';
        // icon.classList.remove('fa-caret-right');
        icon.classList.add('fa-caret-down');
    }
};

export function selectNewList() {
    const listHeader = document.querySelector('.lists-header');
    //'.list-header' exists for Lists
    const icon = listHeader.children[0];
    const listContainer = document.getElementById('task-lists');

    if (!icon.classList.contains('fa-caret-down')) {
        toggleListDisplay(listContainer)
    }
};

// Promises

//selectList is adding a class to an element.
export function selectList(list) {
    return new Promise((res, rej) => {
        list.classList.add('selected-list')
        res();
    })
};

//deselectList is removing a class from an element
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
    return new Promise((res, rej) => {
        const newContainer = showFn()
        container.appendChild(newContainer)
        res()
    })
};

// hide DOM container
export function hideContainer(className) {
    return new Promise((res, rej) => {
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
    if (visibleDiv) {
        visibleDiv.style.display = 'none';
        visibleDiv.classList.remove('visible');
    };

};

// toggle highlight on task creation
export async function toggleTaskHighlight(e) {
    const prevSelected = document.querySelector('.single-task-selected');
    const taskOptions = document.querySelector('.task-options');
    let nextSelection = e.target;

    if (nextSelection.localName == 'label' ||
        nextSelection.localName == 'span') {
        nextSelection = nextSelection.parentNode;
    }

    if (prevSelected && e.target.type != 'checkbox') {
        await removeHighlight(prevSelected, nextSelection);
        if (prevSelected != nextSelection) {
            taskOptions.style.visibility = 'visible';
        } else {
            taskOptions.style.visibility = 'hidden';
        }
    } else {
        await addHighlight(nextSelection);
        if (e.target.type != 'checkbox') {
            nextSelection.children[0].checked = nextSelection.children[0].checked ? false : true;
        }
    }

}

function removeHighlight(prevSelected, nextSelection) {
    return new Promise((res, rej) => {
        nextSelection.classList.add('single-task-selected');
        prevSelected.classList.remove('single-task-selected');
        nextSelection.children[0].checked = nextSelection.children[0].checked ? false : true;
        res();
    });
}

function addHighlight(nextSelection) {
    const taskOptions = document.querySelector('.task-options');
    return new Promise((res, rej) => {
        nextSelection.classList.add('single-task-selected');
        taskOptions.style.visibility = 'visible';
        taskOptions.style.animation = "fadeIn 1s";
        res();
    });
}

// toggle task summary panel
export async function toggleTaskSummary(e) {
    const prevSelected = document.querySelector('.single-task-selected');
    const nextSelection = e.target;
    const taskSummaryDiv = document.querySelector('#task-details');

    if (prevSelected) await showTaskSummary(taskSummaryDiv, prevSelected, nextSelection);
    else await hideTaskSummary(taskSummaryDiv, prevSelected)
};

function showTaskSummary(taskSummaryDiv, prevSelected, nextSelection) {
    return new Promise((res, rej) => {
        const taskSummaryDiv = document.querySelector('#task-details');
        const checked = document.querySelectorAll('input[type="checkbox"]:checked');

        if (checked.length > 1) {
            checked.forEach(node => {
                if (node.checked) {
                    node.parentNode.classList.add('single-task-selected');
                } else {
                    node.parentNode.classList.remove('single-task-selected');
                }
            });
            taskSummaryDiv.classList.remove('task-details-display');
        } else {
            taskSummaryDiv.classList.add('task-details-display');
        }
        res();
    });
};

export function hideTaskSummary(taskSummaryDiv, prevSelected, nextSelection) {
    return new Promise((res, rej) => {
        taskSummaryDiv.classList.remove('task-details-display');
        res();
    });
};
