window.addEventListener("load", async (event) => {
    console.log('Hello from dashbaord-list.js!');
    const res = await fetch('http://localhost:8080/api/lists')
    const { lists } = await res.json();

    const taskList = document.getElementById('task-lists');
    lists.forEach(list => {
        const li = document.createElement('li');
        li.innerText = list.name;
        taskList.appendChild(li);
    });
})
