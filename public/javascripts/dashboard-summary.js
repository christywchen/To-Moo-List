export function addTaskSummaryEventListeners() {
    const summaryTitleInp = document.querySelector('#summary-title');
    const summaryDeadlineInp = document.querySelector('#summary-due-date-inp');
    const summarySelectInp = document.querySelector('#summary-list-select');
    const summaryDescInp = document.querySelector('#summary-desc-textarea');

    console.log(summaryTitleInp)
    summaryTitleInp.addEventListener('blur', changeTaskName);
    summaryDeadlineInp.addEventListener('blur', changeTaskDeadline);
    summarySelectInp.addEventListener('change', changeList);
    summaryDescInp.addEventListener('focus', expandTextarea);
    summaryDescInp.addEventListener('blur', changeDesc);
}

export const changeTaskName = async (e) => {
    const taskId = window.location.href.split('/')[7];
    const newTaskName = e.target.innerText;
    const body = { name: newTaskName }

    console.log(e.target.innerText)

    if (newTaskName) {
        await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const taskLabel = document.querySelector(`label[data-task="${taskId}"]`);
        taskLabel.innerText = newTaskName;
    } else {
        const res = await fetch(`/api/tasks/${taskId}`);
        const { task } = await res.json();

        const summaryTitleInp = document.querySelector('#summary-title');
        summaryTitleInp.innerText = task.name;
    }
};

export const changeTaskDeadline = async (e) => {
    // TO DO: patch request to update task deadline
};

export const changeList = async (e) => {
    e.stopPropagation();
    const stateId = { id: "99" };
    const listId = window.location.href.split('/')[5];
    const taskId = window.location.href.split('/')[7];
    const newlistId = e.target.value;

    if (newlistId === "create-new") {
        addListDiv.style.display = 'block';
        addListDiv.style.position = 'fixed';
    } else {
        const body = { listId: parseInt(newlistId, 10) }
        await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    }

    const taskContainer = document.querySelector('#tasksContainer');
    // const movedTask = document.querySelector(`[data-task="${taskId}"]`);
    // taskContainer.removeChild(movedTask);

    // if list id is different than the previous list
    console.log(listId)
    console.log(newlistId)
    window.history.replaceState(stateId, `List ${listId}`, `/dashboard/#list/${listId}`);


    const taskDetailsDiv = document.querySelector('#task-details');
    taskDetailsDiv.classList.remove('task-details-display');
    console.log('test')
};

export const changeDesc = async (e) => {
    const taskId = window.location.href.split('/')[7];
    const newTaskDesc = e.target.value;
    const body = { description: newTaskDesc }

    if (newTaskDesc) {
        await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    };
};

export function showTaskSummary(e) {
    // UPDATE FUNCTIONALITY TO ACCOMMODATE FOR WHEN LIST SELECTION CHANGES
    // const prevListSelection = window.location.href.split('/')[5];
    // const nextListSelection = e.target.dataset.listId;
    const prevTaskSelection = window.location.href.split('/')[7];
    const nextTaskSelection = e.target.dataset.task;
    const taskDetailsDiv = document.querySelector('#task-details');

    if (prevTaskSelection === nextTaskSelection) {
        if (!taskDetailsDiv.classList.contains('task-details-display')) {
            taskDetailsDiv.classList.remove('task-details-display');
        } else {
            taskDetailsDiv.classList.add('task-details-display');
        }
    } else {
        taskDetailsDiv.classList.add('task-details-display');
    }


}

export async function expandTextarea(e) {
    const summaryDescInp = document.querySelector('#summary-desc-textarea');
    summaryDescInp.classList.add('summary-inp-focus');
}

export async function shrinkTextarea(e) {
    const summaryDescInp = document.querySelector('#summary-desc-textarea');
    summaryDescInp.classList.remove('summary-inp-focus');
}

export async function expandCheckedTask(e) {

}
