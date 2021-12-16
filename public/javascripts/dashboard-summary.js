export const changeTaskName = async (e) => {
    const taskId = window.location.href.split('/')[7];
    const newTaskName = e.target.innerText;
    const body = { name: newTaskName }

    await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const taskLabel = document.querySelector(`label[data-task="${taskId}"]`);
    taskLabel.innerText = newTaskName;
};

export const changeTaskDeadline = async (e) => {
    // TO DO: patch request to update task deadline
};

export const changeList = async (e) => {
    // TO DO: patch request to update task deadline

    // const listId = e.target.value;
    // const body = { name: newTaskName }

    // await fetch(`/api/tasks/${taskId}`, {
    //     method: "PATCH",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(body)
    // });


    // const res = await fetch(`/api/lists/${listId}`);
    // const { list } = res.json();

    // console.log(list.name)
};
