window.addEventListener("load", async (event) => {
    console.log('Hello from dashbaord-list.js!');
    const res = await fetch('http://localhost:8080/api/lists')
    const { lists } = await res.json();

    const fetchListTasks = async (e) => {
        e.preventDefault();
        console.log(e.target.className)
        const taskRes = await fetch(`http://localhost:8080/api/lists/${e.target.className}/tasks`)
        const { tasks } = await taskRes.json();
        
        // get task div
        const taskContainer = document.getElementById("taskContainer");
        tasks.forEach(task => {
            const div = document.createElement("div");
            div.innerHTML = `
            <input type="checkbox" id="${task.name}" name="${task.name}" value="${task.name}">
            <label for="${task.name}">${task.name}</label>
            <div hidden class='categories'>mwhahahah</div>
            `
            taskContainer.appendChild(div);
        })
    
        // append tasks to task div
    }
    // // <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">

    const taskList = document.getElementById('task-lists');
    lists.forEach(list => {
        const li = document.createElement('li');
        li.innerText = list.name
        li.className = list.id
        li.addEventListener('click', fetchListTasks)
        taskList.appendChild(li);
    });
})
