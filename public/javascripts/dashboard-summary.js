export const changeTaskName = async (e) => {
    const taskId = window.location.href.split('/')[7];
    const newTaskName = e.target.innerText;
    const body = { name: newTaskName }

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
    console.log(taskId)

    if (newlistId === "create-new") {
        // const addListDiv = document.querySelector('#add-list');
        // addListDiv.style.display = 'block';
        // addListDiv.style.position = 'fixed';
        // const res = await fetch(`/api/tasks/${taskId}`);
        // const { task } = await res.json();
        // console.log(task.listId)
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
    const movedTask = document.querySelector(`[data-task="${taskId}"]`);
    taskContainer.removeChild(movedTask);

    window.history.replaceState(stateId, `List ${listId}`, `/dashboard/#list/${listId}`);
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

export function showTaskSummary(visible) {
    const taskSummaryContainer = document.querySelector('.task-summary');
    if (visible === true) {
        taskSummaryContainer.classList.add('task-summary-display');
    } else {
        taskSummaryContainer.classList.remove('task-summary-display');
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
