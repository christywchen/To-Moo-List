export function clearDOMTasks() {
    const taskDivs = document.querySelectorAll('.single-task')
    if (taskDivs) {
        taskDivs.forEach(child => {
            child.remove();
        })
    }
};
