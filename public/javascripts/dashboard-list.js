let listId;

// Initialze Page
const initializePage = async () => {
    const fetchListTasks = async (e) => {
        e.preventDefault();
        const stateId = { id: "100" };
        const taskRes = await fetch(`/api/lists/${e.target.className}/tasks`)
        const { tasks } = await taskRes.json();
        const taskContainer = document.getElementById("taskContainer");
        tasks.forEach(task => {
            const div = document.createElement("div");
            div.innerHTML = createTaskHtml(task.name);
            taskContainer.appendChild(div);
        })

        window.history.replaceState(stateId, `List ${e.target.className}`, `/#list/${e.target.className}`);
    };

    const res = await fetch('http://localhost:8080/api/lists')
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
function createTaskHtml(taskName) {
    return ` <input type="checkbox" id="${taskName}" name="${taskName}" value="${taskName}">
                <label for="${taskName}">${taskName}</label>
                <div hidden class='categories'>mwhahahah</div>`;
};

const createTask = async (e) => {
    e.preventDefault();
    const taskData = document.querySelector('#add-task-form');
    const taskContainer = document.getElementById("taskContainer");
    const formData = new FormData(taskData);
    const name = formData.get('name');
    const body = { name, listId };
    const div = document.createElement('div');
    const input = document.getElementById('name');
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
    }
};

const submitDiv = document.querySelector('#add-task-form');
const addTask  = document.querySelector('.addTaskButton');
const taskDiv = document.querySelector('.addTaskDiv');

const showButton = (e) => {
    addTask.hidden = false;
    taskDiv.hidden = false;
    console.log(taskDiv.hidden, addTask.hidden)
};
const hideButton = (e) => {
    e.stopPropagation()
    if (e.target.id !== ('name' || 'taskButton')) {
        addTask.hidden = true;
        taskDiv.hidden = true;
    }
};


// Load events
window.addEventListener("load", async (event) => {
    initializePage();
    addTask.addEventListener('click', createTask);
    submitDiv.addEventListener('click', showButton);
    document.addEventListener('click', hideButton);
});
