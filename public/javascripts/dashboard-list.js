let listId;

// export const hello = () => {
//     console.log("hello")
// }

// Initialze Page
const initializePage = async () => {
    const fetchListTasks = async (e) => {
        e.preventDefault();
        const stateId = { id: "100" };
        const taskRes = await fetch(`/api/lists/${e.target.className}/tasks`)
        const { tasks } = await taskRes.json();
        const taskContainer = document.getElementById("tasksContainer");
        tasks.forEach(task => {
            const div = document.createElement("div");
            div.innerHTML = createTaskHtml(task.name);
            taskContainer.appendChild(div);
        })

        // TODO look into window.history.pushState
        // Look into remove listId from closure and get from fragment URL
        window.history.replaceState(stateId, `List ${e.target.className}`, `/dashboard/#list/${e.target.className}`);
    };

    const res = await fetch('/api/lists')
    const { lists } = await res.json();
    const taskList = document.getElementById('task-lists');
    listId = lists[0].id;

    lists.forEach(list => {
        const li = document.createElement('li');
        li.innerText = list.name
        li.className = list.id
        li.addEventListener('click', fetchListTasks)
        taskList.appendChild(li);
    });
}

// Helper Functions
export function createTaskHtml(taskName) {
    return ` <input type="checkbox" id="${taskName}" name="${taskName}" value="${taskName}">
                <label for="${taskName}">${taskName}</label>
                <div hidden class='categories'>mwhahahah</div>`;
};

const createTask = async (e) => {
    e.preventDefault();
    const taskData = document.querySelector('#add-task-input');
    const taskContainer = document.getElementById("tasksContainer");
    const formData = new FormData(taskData);
    const name = formData.get('name');
    const body = { name, listId };
    const div = document.createElement('div');
    const input = document.getElementById('name');
    div.classList.add('task')
    if (input.value.length) {
        div.innerHTML = createTaskHtml(name);
        taskContainer.appendChild(div);
        try {
            const res = await fetch(`api/lists/${listId}`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" }
            })
            if (!res.ok) { throw res }
        } catch (err) {
            // TODO finish error handling
            console.error('-Unable to reach database-');
        }
        const addTaskInp = document.querySelector('input#name.inp-field');
        addTaskInp.value = "";
    }
};

const addTaskFormDiv = document.querySelector('#add-task-form');
const addTaskInp = document.querySelector('input#name.inp-field');
const addTaskButtonDiv = document.querySelector('.add-task-button');
const addTaskButton = document.querySelector('.add-task-button button');

// Load events
window.addEventListener("load", async (event) => {
    initializePage();
    addTaskButton.addEventListener('click', createTask);
    document.addEventListener('click', (e) => {
        // show submit button if event target is a descendent of addTaskFormDiv
        // otherwise, do not show the submit button
        if (addTaskFormDiv.contains(e.target)) {
            e.preventDefault()
            addTaskButtonDiv.classList.add('add-task-button-transition');
        }
        else {
            addTaskButtonDiv.classList.remove('add-task-button-transition');
        }
    });

    addTaskInp.addEventListener('keyup', (e) => {
        e.preventDefault()
        if (addTaskInp.value) {
            addTaskButton.disabled = false;
        } else {
            addTaskButton.disabled = true;
        }
    });

});
