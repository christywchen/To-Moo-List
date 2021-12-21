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


export function clearInput(formId) {
    const form = document.getElementById(`${formId}`);
    console.log(form);
    console.log('form data: ', form.data)
    form.value = '';
};


export function clearSearch(e) {
    if (!e.target.classList.contains('search-container')) {
        clearSearchRecs();
        clearInput('search');
    }
}
