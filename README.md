# To Moo List

Live Demo: [To-Moo-List](http://to-moo-list.herokuapp.com/)

[![home-page.png](https://i.postimg.cc/SKB4XRQP/home-page.png)](https://postimg.cc/060FF8wG)

# General Info

## A Brief Overview

To Moo, or not To Moo? Ponder no more.

Let it be known that you should always just moo it.

To Moo List is a clone of another web application called [Remember the Milk](https://www.rememberthemilk.com), but with our own twist. This website application is a **online to-do app** to help you stay organized and help remember your tasks/errands.

At To Moo List, users can create accounts and access a dashboard tailored for personal task management. From the dashboard, users are able to create tasks, give tasks deadlines and descriptions, tag tasks by priority level, create lists for those tasks, organize tasks into various lists, and mark tasks as complete. Users can also see summaries of all pending tasks, pending tasks that are due today or tomorrow, and postpone any desired tasks. Tasks can be edited individually or edited by bulk


## Overall Structure

### Back End
This app was built using **JavaScript** on the backend with a **postgreSQL** database. The back-end structure utilizes **RESTful** API routes and all the data request uses fetch and other promise functions to retrieve/update/delete data from the database.

### Front End
The frontend was built with [pug](https://pugjs.org/api/getting-started.html) templates and written in **JavaScript**. **CSS** was used for all styling. The entirety of the user dashboard was created by means of DOM Manipulation and does not require any reloading or refreshing in order to make fetch calls to the backend database. The routes for the frontend also follow **RESTful** convention.

### Libraries
* [BCrypt](https://www.npmjs.com/package/bcrypt)
* [cookie-parser](https://www.npmjs.com/package/cookie-parser)
* [csurf](https://www.npmjs.com/package/csurf)
* [express](https://www.npmjs.com/package/express)
* [express-session](https://www.npmjs.com/package/express-session)
* [express-validator](https://www.npmjs.com/package/express-validator)
* [pg](https://www.npmjs.com/package/pg)
* [pug](https://www.npmjs.com/package/pug)
* [sequelize](https://www.npmjs.com/package/sequelize)

# Primary Components

### User Authorization
User authentication is handled in JavaScript whilst using BCrypt for password hashing. For security, user passwords are hashed before getting saved to the database. When the user logs in, the password they provide are rehashed to see if the match the one with the data base to verify the users credentials.

[![login-page.png](https://i.postimg.cc/6p1tXzkt/login-page.png)](https://postimg.cc/FYc2bbFB)

### Dashboard Page
This page is where the magic happens. After the user's credentials have been confirmed, the users can access the dashboard page and start creating their own tasks as their reminder application. Users will be able to navigate around the dashboard without page refreshes or reloads. The left side of the page shows a sidebar for list navigation, the center of the page shows a lists of pending tasks, and the right side of the page shows information about task completion progress. When users click on an individual task, a panel will slide out to the right side of the page and show details about the given task.

[![dashboard-page.png](https://i.postimg.cc/htGc6N32/dashboard-page.png)](https://postimg.cc/56DhFKJz)

### Adding Tasks
Users can add task first clicking on the **input bar** at the top middle of the page and type the task they want to add. Once the user types something into the input bar, the **moo** button should appear to finally add the task, but if the user doesn't type anything into the input bar, the **moo** button will be disabled, thus unable to enter a blank task. If the user doesn't want to click it, they can also add the task by pressing the **Enter key** on their keyboard to add the task as well.

[![input-task-bar.png](https://i.postimg.cc/NjxJRZ0k/input-task-bar.png)](https://postimg.cc/FY7V4W3Y)

### Navigating Lists & Creating/Adding Lists
To navigate through different lists, users can access them by clicking on different tabs on the sidebar to the left of the page. Clicking the **Inbox** link to toggle links for lists provided by default. These include **Today's Tasks**, **Tomorrow's Tasks**, **All Tasks**, and **Completed Tasks**. Users can also click on **Lists** to see a dropdown of custom lists or **Priority** to view a dropdown of lists which organize tasks according to the priority that the user has set for any given task.

[![side-bar-menu.png](https://i.postimg.cc/CKFCY1Sj/side-bar-menu.png)](https://postimg.cc/9DnwYc4M)

If the user would like to create a custom list to further organize their tasks, there is a **+** icon on the left side bar on the page that allows them to do so. Clicking on the icon will initialize a pop-up that prompts the user to enter a list name. Once the user hits the **Add** button, they will be taken to the new list and can begin adding tasks to the list.

Custom lists can be further edited. When hovering over an individual list name, an icon will show up to the right side of the list. When clicked, the user will be provided options to delete or rename the list. If the user chooses to delete the list, all tasks associated with that list will also be removed.

[![list-add-pop-up.png](https://i.postimg.cc/9fRVFZ2T/list-add-pop-up.png)](https://postimg.cc/R3B2g3NV)

### Creating Tasks and Editing Task Information

Tasks can be edited individually or bulk edited from the task bar, which is the row of icons at the top of the task container. User can select one or more tasks by checking off tasks and clicking on icons that will mark them complete, postpone the deadline by up to five days, set the deadline further into the future, change the list in which the task(s) belong, and delete the task(s).

[![task-options.png](https://i.postimg.cc/CKmGKgx9/task-options.png)](https://postimg.cc/R3J6P2fT)

Individual tasks can also be edited by selecting the task from the list. A task summary will slide out to the right side of the screen and offer options to rename the task, edit the deadline, priority, or description, and move them to new or existing lists. Each change to a task is updated dynamically and will be saved to the database as soon as the user clicks a dropdown option or moves their mouse focus away from an input. The webpage will also display the updated information immediately.

# Local Installation

The project requires Node.js, NPM, and PostgreSQL. It can be installed locally by downloading the repo, creating a PostgreSQL database user with database creation authority, a PostgreSQL database, then saving the database credentials to a .env file in the root directory based on the provided .env.example file.

Then, run the following in the root directory in order to install the necessary dependencies and begin running To Moo List on a local server:

```
npm install
```
Migrate and run the seeder files for the database using:
```
npx dotenv sequelize db:create
npx dotenv sequelize db:migrate
npx dotenv sequelize db:seed:all
```
Once all the tables and seeder file has been added to the data, you can run this command to run the application locally on your computer.
```
npm start
```
Note that the seeder files are necessary for populating the default priorities available to tasks: High, Medium, and Low.

From there, a new account can be created and used to sign in.

# Future Features
- Recurring tasks
- User contacts
- Sharing and assigning tasks to user in contacts list
- Custom dashboard color themes
- User info editing
- Auto-archiving of completed tasks
- User can mark a completed task as incomplete
- Undo button for most list or task change

# Technical implementation details
Here are few snippets of code that we are proud to share with everyone.

With tasks being populted to the main dashboard in many different ways throughout the code, each task still needed to be populated with the same structure and functionality. This was approached via boilerplate functions to populate and decorate the task divs.

```JavaScript
async function decorateTaskDiv(div, task) {
    const prioritySpan = await decorateTaskWithPriority(div, task);
    const deadlineSpan = await decorateTaskWithDeadline(div, task);

    div.setAttribute('data-task', `${task.id}`);
    div.classList.add('single-task');
    div.innerHTML = createTaskHtml(task.name, task.id);
    div.addEventListener('click', getDropMenu);
    div.addEventListener('click', toggleTaskHighlight);
    div.addEventListener('click', fetchTaskSummary);
    div.addEventListener('click', toggleTaskSummary);

    div.appendChild(prioritySpan);
    div.appendChild(deadlineSpan);
};

```

Selecting/deselecting list via vanilla javascript was handled in various ways. Deselecting by clicking away from an item was handled via a global click event listener on the document object. This worked well, however provided a separation of concerns issue while debugging at times. Toggling a selection was often handled using async functions and promises to await the appropriate selecting and deselecting sqeuence.

```JavaScript
function selectList(list) {
    return new Promise((res, rej) => {
        list.classList.add('selected-list')
        res();
    })
};

function deselectList() {
    return new Promise((res, rej) => {
        const selected = document.querySelector('.selected-list');
        if (selected) {
            selected.classList.remove('selected-list');
        }
        res();
    })
}
```

Due to specific database associations between items, each item's particular data needed to be tracked as different parts of the application interacted with that element. To solve this we used the data attribute to store particular identifiers on individual items when possible. Since multiple functions depended on knowing what list was currently selected, we organized our CRUD functions to utilize closure so that this data could be shared and updated when actions were performed.

```javascript

export function createSidebarContainer(name, containerType, data,) {
    const container = document.createElement('div');
    const itemDiv = document.createElement('div');
    container.classList.add(`${containerType}-box`, 'sidebar-box');
    container.style.position = 'relative';
    container.setAttribute(`data-${containerType}Id`, `${data}`);

    itemDiv.innerText = name;
    itemDiv.setAttribute(`data-${containerType}Id`, `${data}`);
    itemDiv.className = `${containerType}-item`;

    container.appendChild(itemDiv);

    return container;
}

export async function fetchListTasks(e) {
    e.stopPropagation();
    clearDOMTasks();
    const stateId = { id: "100" };
    const boxTarget = e.target.classList.contains('list-box');
    const listTarget = e.target.classList.contains('list-item')
    if (boxTarget || listTarget) {
        listId = e.target.dataset.listid;
        const taskRes = await fetch(`/api/lists/${listId}/tasks`);
        const { tasks } = await taskRes.json();
        populateTasks(tasks);
        window.history.replaceState(stateId, `List ${e.target.dataset.listid}`, `/dashboard/#list/${e.target.dataset.listid}`);
    }
};
```

As for selecting/deselecting, we used many functions to help achieve this feature. To select the task, we had a event listener to check to see if a div containing the task is clicked, but if others parts of the div were clicked, (i.e. the label, span etc) we converted back to the parent div in-order to put a highlight feature along with brining the summary of the task. Using the same function we were able to detect whether the same div was being clicked and if it was we would remove the highlight feature as a whole.

```javascript
async function toggleTaskHighlight(e) {
    const prevSelected = document.querySelector('.single-task-selected');
    const taskOptions = document.querySelector('.task-options');
    let nextSelection = e.target;
    const url = window.location.href.split('/')[4];

    if (nextSelection.localName == 'label' ||
        nextSelection.localName == 'span' ||
        e.target.type == 'checkbox') {
        nextSelection = nextSelection.parentNode;
    }

    if (prevSelected == nextSelection || e.target.type == 'checkbox'){
        await removeHighlight(nextSelection);
        if (url !== '#completed') taskOptions.style.visibility = 'hidden';
    } else {
        if (nextSelection.classList.contains('single-task-selected')) await removeHighlight(nextSelection);
        else await addHighlight(nextSelection);
    }
}

function removeHighlight(selectedDiv) {
    return new Promise((res, rej) => {
        selectedDiv.classList.remove('single-task-selected');
        if (selectedDiv.children[0].checked) selectedDiv.children[0].checked = false;
        res();
    });
}


function addHighlight(nextSelection) {
    const taskOptions = document.querySelector('.task-options');
    const url = window.location.href.split('/')[4];
    return new Promise((res, rej) => {
        nextSelection.classList.add('single-task-selected');
        nextSelection.children[0].checked = true;
        res();
    });
}
```

