export async function updateTaskStatus() {
    const all = await fetch('/api/tasks/');
    const { tasks: allTasks } = await all.json();
    const todays = await fetch('/api/tasks/today');
    const { tasks: todaysTasks } = await todays.json();

    let inProgress = 0;
    let dueToday = 0;
    let completed = 0;

    allTasks.forEach(task => {
        if (task.isCompleted) completed++;
        else inProgress++;
    });

    todaysTasks.forEach(task => {
        if (!task.isCompleted) dueToday++;
    })

    const inProgressDiv = document.querySelector('#recap-in-progress');
    inProgressDiv.innerHTML = inProgress;

    const dueTodayDiv = document.querySelector('#recap-due-today');
    dueTodayDiv.innerHTML = dueToday;

    const completedDiv = document.querySelector('#recap-completed');
    completedDiv.innerHTML = completed;

}
