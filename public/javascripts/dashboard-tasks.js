import { updateTaskStatus } from './dashboard-recap.js'
import { updatePriorityTag, updateDeadlineTag, changeTaskDeadline, moveTaskToNewList, moveTaskFromList, moveTaskFromTodayOrTomorrow } from './dashboard-summary.js'
import { getDate, buildPrioritySelectOptions, decorateTaskWithDeadline } from './create-dom-elements.js';
import { hideDivContainer, hideTaskSummary, selectNewList } from './display.js'

export const checkAllBoxes = (e) => {
    const checkBox = document.querySelector('.checkbox-all > input');
    const taskOptions = document.querySelector('.task-options');
    const url = window.location.href.split('/')[4];

    if (!e.target.classList.contains("checkbox-all")) {
        if (checkBox.checked) {
            const allCheckBox = document.querySelectorAll(".single-task > input");
            allCheckBox.forEach((e) => {
                if (!e.checked) {
                    e.checked = true;
                }
                e.parentNode.classList.add('single-task-selected');
            })
            if (url !== '#completed') taskOptions.style.visibility = 'visible';
            taskOptions.style.animation = "fadeIn 1s";
        } else {
            const allCheckBox = document.querySelectorAll(".single-task > input");
            allCheckBox.forEach((e) => {
                if (e.checked) {
                    e.checked = false;
                }
                e.parentNode.classList.remove('single-task-selected');
            })
            if (url !== '#completed') taskOptions.style.animation = "fadeOut 1s";
            taskOptions.style.visibility = 'hidden';
        }
    }
}

export const uncheckCheckBox = (e) => {
    const checkBox = document.querySelector('.checkbox-all > input');
    checkBox.checked = false;
}

export const hideTaskOptions = (e) => {
    const taskOptions = document.querySelector('.task-options');
    taskOptions.style.visibility = 'hidden';
}

export const finishTask = (e) => {
    /*
    This function completes the task that has check marks on the checkbox.
    It finishes the task by first getting all the tasks that are checked using
    querySelectAll and iterates them and marks the each task in the database as complete
    */
    const completeTask = document.querySelector(".completed");
    const taskSummaryDiv = document.querySelector('#task-details');

    const selectedTasks = document.querySelectorAll(".single-task > input"); // selects all the tasks
    selectedTasks.forEach(async (e) => {
        if (e.checked) { // checks the to see if the checkbox is checked or not
            const res = await fetch(`/api/tasks/${e.dataset.task}`, { // 20-25 updates the task in database to complete
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ isCompleted: true })
            });
            if (!res.ok) {
                console.log("Something went wrong");
            } else {
                completeTask.style.animation = "fetchSuccess 1s"; // lights the checkmark div green if its successful
                updateTaskStatus(); //updates task summary that are on the side that shows how many tasks we have and are complete, etc
                const deleteDiv = document.querySelector(`[data-task="${e.dataset.task}"]`);
                if (deleteDiv) {
                    deleteDiv.remove();
                    await hideTaskSummary(taskSummaryDiv); //hides the task summary
                }
                uncheckCheckBox();
            }
        }
    })
};

export const postPoneTask = async (e) => {
    /*
    This function postpones the task that has check marks on the checkbox.
    It postpones the task by first getting all the tasks that are checked using
    querySelectAll and iterates them and postpone the each task in the database
    */
    const selectedTasks = document.querySelectorAll(".single-task > input"); // selects all the tasks
    const extendCal = document.querySelector(".postpone-dates");
    const timeStamp = e.target.getAttribute("value");
    const extendDiv = document.querySelector('.postpone');

    selectedTasks.forEach(async (e) => {
        if (e.checked) { // only updates in database for task with checkmarks
            const newDateVal = new Date(timeStamp).toISOString().replace('T', ' ').replace('Z', '');

            const res = await fetch(`/api/tasks/${e.dataset.task}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ deadline: `${newDateVal}` })
            })
            if (!res.ok) {
                console.log("Something went wrong");
            } else {
                const { task: updatedTask } = await res.json();
                updateDeadlineTag(updatedTask);
                moveTaskFromTodayOrTomorrow(updatedTask)

                const taskSummary = document.querySelector('#task-details');

                if (taskSummary.classList.contains('task-details-display')) {
                    const taskSummaryDate = document.querySelectorAll('#summary-due-date-inp')[1];
                    taskSummaryDate.setAttribute('value', getDate(newDateVal));
                }

                extendCal.style.display = 'none';
                extendDiv.style.animation = 'fetchSuccess 1s';
                updateTaskStatus(); //updates task summary that are on the side that shows how many tasks we have and are complete, etc
                uncheckCheckBox();
            }
        }
        selectNewList();
    })
}


export const moveTask = async (e) => {
    /*
    This function move the task into different list that has check marks on the checkbox.
    It moves the task by first getting all the tasks that are checked using
    querySelectAll and iterates them and changes the list of the tag that it belongs to
    */
    const selectedTask = document.querySelectorAll(".single-task > input"); // selects all the tasks
    const listMenu = document.querySelector('.list-of-lists');
    const listId = e.target.id;
    const taskSummaryDiv = document.querySelector('#task-details');

    selectedTask.forEach(async (e) => {
        if (e.checked) { // only updates in database for task with checkmarks
            const res = await fetch(`/api/tasks/${e.dataset.task}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ listId: `${listId}` })
            })
            if (!res.ok) {
                console.log("Something went wrong");
            } else {
                const { task } = await res.json();
                const deleteDiv = document.querySelector(`[data-task="${e.dataset.task}"]`);
                await hideTaskSummary(taskSummaryDiv);

                listMenu.style.display = 'none';

                moveTaskFromList(task)

                updateTaskStatus(); //updates task summary that are on the side that shows how many tasks we have and are complete, etc
                uncheckCheckBox();
            }
        }
    })
}

export const changeTag = async (e) => {
    /*
    This function changes the tag on the task with check marks on the checkbox.
    It changes the tag on the task by first getting all the tasks that are checked using
    querySelectAll and iterates them and changes that tag that it belongs to
    */
    const selectedTasks = document.querySelectorAll(".single-task > input"); // selects all the tasks
    const tag = document.querySelector(".list-of-tags");
    const taskSummaryDiv = document.querySelector('#task-details');
    const url = window.location.href.split('/'); // grabs the url of the current page
    const taskPriorityName = ['High', 'Medium', 'Low', 'None'];
    const tagId = e.target.id;

    selectedTasks.forEach(async (e) => {
        if (e.checked) { // only updates in database for task with checkmarks
            const res = await fetch(`/api/tasks/${e.dataset.task}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ priorityId: `${tagId}` })
            })
            if (!res.ok) {
                console.log("Something went wrong");
            } else {
                //console.log("it worked");
                const { task } = await res.json();
                const taskSummary = document.querySelector('#summary-priority-select');
                if (taskSummary) {
                    taskSummary.innerHTML = "";
                    tag.style.display = 'none';
                    buildPrioritySelectOptions(taskPriorityName[task.priorityId - 1], task.priorityId); // updates the priority options in the task summary
                    updatePriorityTag(task);
                }
                updateTaskStatus(); //updates task summary that are on the side that shows how many tasks we have and are complete, etc
                if (url.includes("#priority")) {
                    const deleteDiv = document.querySelector(`[data-task="${e.dataset.task}"]`);
                    if (deleteDiv) deleteDiv.remove();
                    await hideTaskSummary(taskSummaryDiv); //hides the task summary
                };
                uncheckCheckBox();
            }
        }
    })
}

export const deleteTask = (e) => {
    /*
    This function deletes the task with check marks on the checkbox.
    It deletes the task by first getting all the tasks that are checked using
    querySelectAll and deletes them from the DOM and the database
    */
    const trashTask = document.querySelector(".delete");
    const taskSummaryDiv = document.querySelector('#task-details');

    const selectedTasks = document.querySelectorAll(".single-task > input"); // selects all the tasks
    selectedTasks.forEach(async (e) => {
        if (e.checked) { // only updates in database for task with checkmarks
            const res = await fetch(`/api/tasks/${e.dataset.task}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!res.ok) {
                console.log("Something went wrong");
            } else {
                //console.log("Your task was deleted")
                trashTask.style.animation = "fetchSuccess 1s";
                updateTaskStatus();
                const deleteDiv = document.querySelector(`[data-task="${e.dataset.task}"]`);
                if (deleteDiv) {
                    deleteDiv.remove();// delets the task item from the DOM
                    await hideTaskSummary(taskSummaryDiv); //hides the task summary
                }
                uncheckCheckBox();
            }
        }
    })
}


export const getDropMenu = (e) => {
    const dropDown = document.querySelectorAll('.drop-square');
    dropDown.forEach(d => {
        d.addEventListener("click", getDropMenu);
    })

    const listMenu = document.querySelector('.list-of-lists');
    const moveCal = document.querySelector('.moveTo');
    moveCal.addEventListener('click', (e) => {
        hideDivContainer()
        listMenu.style.display = 'block';
        // listMenu.style.animation = "growDown .5s ease";
        listMenu.classList.add('visible');
    })

    const postponeList = document.querySelector('.postpone-dates');
    const helpCal = document.querySelector('.postpone');
    helpCal.addEventListener('click', (e) => {
        hideDivContainer()
        postponeList.style.display = 'block';
        // postponeList.style.animation = "growDown .5s ease";
        postponeList.classList.add('visible');
    })

    // const alert = document.querySelector(".alert");
    // alert.addEventListener('click', (e) => {
    //     window.alert("MOOOOOOOOO")
    // })

    const priorityList = document.querySelector('.list-of-tags');
    const tag = document.querySelector('.priority'); // was .c/ategory
    tag.addEventListener('click', (e) => {
        hideDivContainer();
        priorityList.style.display = 'block';
        // priorityList.style.animation = "growDown .5s ease";
        priorityList.classList.add('visible');
    })

    const calDiv = document.querySelector('.due');
    const getCal = document.querySelector('.hidden-cal');
    calDiv.addEventListener('click', (e) => {
        hideDivContainer()
        getCal.style.display = 'block';
        // getCal.style.animation = "growDown .5s ease";
        getCal.classList.add('visible');
    })
}

const createListDropDown = async () => {
    const res = await fetch('/api/lists')
    const { lists } = await res.json();

    const listMenu = document.querySelector(".list-of-lists");
    lists.forEach(list => {
        const listOption = document.createElement('div');
        listOption.innerHTML = `${list.name}`;
        listOption.setAttribute("class", "dropdown-row");
        listOption.setAttribute("id", list.id);
        listOption.setAttribute("name", list.name);
        listOption.setAttribute("value", list.name);
        listOption.addEventListener("click", moveTask);
        listMenu.appendChild(listOption);
    })

}

const createPostPoneList = async () => {
    const postponeList = document.querySelector('.postpone-dates');
    const today = new Date();
    const date = ["1 days", '2 days', '3 days', '4 days', '5 days']
    for (let i = 0; i < 5; i++) {
        today.setDate(today.getDate() + 1);
        const readable = today.toISOString().split('T')[0]
        const div = document.createElement('div');
        div.innerText = date[i] + " (" + readable + ")";
        div.setAttribute("name", "date");
        div.setAttribute("value", today);
        div.addEventListener("click", postPoneTask);
        postponeList.appendChild(div);
    }
}

const createTagList = async () => {
    const priorityList = document.querySelector('.list-of-tags');
    const tags = await fetch('/api/priorities');
    const { priorities } = await tags.json();
    priorities.forEach(tag => {
        const div = document.createElement('div');
        div.innerText = tag.name
        div.setAttribute("name", tag.name);
        div.setAttribute("value", tag.name);
        div.setAttribute("id", tag.id);
        div.addEventListener("click", changeTag);
        priorityList.appendChild(div);
    });
}

const createCalendar = async (e) => {
    const calDiv = document.querySelector('.hidden-cal');
    calDiv.setAttribute('id', 'deadline-div');
    const today = getDate();

    calDiv.innerHTML = `
            <input type="date" min="${today}" value="${today}" id="summary-due-date-inp" class="summary-inp"></input>
            `;
    // Look at dashboard-summary.js on LINE 47-79
    const hiddenCal = document.querySelector('.hidden-cal input');
    hiddenCal.addEventListener('change', (e) => {
        const selectedTasks = document.querySelectorAll(".single-task > input"); // selects all the tasks
        selectedTasks.forEach(async (e) => {
            if (e.checked) {
                if (hiddenCal.value == '') {
                    return;
                } else {
                    const newDateVal = new Date(hiddenCal.value).toISOString().replace('T', ' ').replace('Z', '');
                    const res = await fetch(`/api/tasks/${e.dataset.task}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ deadline: `${newDateVal}` })
                    })
                    if (!res.ok) {
                        console.log("Something went wrong");
                    } else {
                        //console.log("it worked");
                        // const deadlineLabel = document.querySelector(`div[data-task="${e.dataset.task}"]`);
                        const { task: updatedTask } = await res.json();
                        updateDeadlineTag(updatedTask);
                        moveTaskFromTodayOrTomorrow(updatedTask)

                        const taskSummary = document.querySelector('#task-details');

                        if (taskSummary.classList.contains('task-details-display')) {
                            const taskSummaryDate = document.querySelectorAll('#summary-due-date-inp')[1];
                            taskSummaryDate.setAttribute('value', getDate(newDateVal));
                        }

                    }
                }
            }
        })




    });
}

export const createDropDownMenu = () => {
    createListDropDown();
    createPostPoneList();
    createTagList();
    createCalendar();
}
