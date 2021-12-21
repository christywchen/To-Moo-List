export function clearDOMTasks() {
    const taskDivs = document.querySelectorAll('.single-task')
    if (taskDivs) {
        taskDivs.forEach(child => {
            child.remove();
        })
    }
};

export function clearSearchRecs() {
    const recContainer = document.querySelectorAll('.search-rec');
    if (recContainer) {
        recContainer.forEach(child => {
            child.remove();
        })
    }
}

export function clearTaskSummary() {
    const taskSummary = document.querySelector('#task-details');
    console.log(taskSummary)
    if (taskSummary.innerHTML) {
        while (taskSummary.firstChild) {
            taskSummary.removeChild(taskSummary.lastChild);
        }
    }
}
