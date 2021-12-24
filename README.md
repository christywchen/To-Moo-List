# To Moo List

Live Demo: [To-Moo-List](http://to-moo-list.herokuapp.com/)

<< Insert picture of home page here >>

# General Info

## A Brief Overview

To Moo, or not To Moo? Our choice will always be the latter. 

To Moo List is a clone of another web application called [Remember the Milk](https://www.rememberthemilk.com), but with our own twist. This website application is a **online to-do app** to help you stay organized and help remember your tasks/errands. 

At To Moo List, users can create accounts and access a dashboard tailored for personal task management. From the dashboard, users are able to create tasks, give tasks deadlines and descriptions, tag tasks by priority level, create lists for those tasks, organize tasks into various lists, and mark tasks as complete. Users can also see summaries of all pending tasks, pending tasks that are due today or tomorrow, and postpone any desired tasks. Tasks can be edited individually or edited by bulk.
  
<< Insert picture of dashboard >>

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

## User Authorization
User authentication is handled in JavaScript whilst using BCrypt for password hashing. For security, user passwords are hashed before getting saved to the database. When the user logs in, the password they provide are rehashed to see if the match the one with the data base to verify the users credentials. 

<< INSERT LOGIN PAGE PICTURE HERE >>

## Dashboard Page
This page is where the magic happens. After the user's credentials have been confirmed, the users can access the dashboard page and start creating their own tasks as their reminder application. Users will be able to navigate around the dashboard without page refreshes or reloads. The left side of the page shows a sidebar for list navigation, the center of the page shows a lists of pending tasks, and the right side of the page shows information about task completion progress. When users click on an individual task, a panel will slide out to the right side of the page and show details about the given task.

<< INSERT PICTURE OF DASHBOARD PAGE

## Adding Tasks
Users can add task first clicking on the **input bar** at the top middle of the page and type the task they want to add. Once the user types something into the  input bar, the **moo** button should appear to finally add the task. If the user doesn't want to click it, they can also add the task by pressing the **Enter key** on their keyboard to add the task as well.

<< INSERT PICTURE OF INPUT TASK BAR >>

## Navigating Lists & Creating/Adding Lists
To navigate through different lists, users can access them by clicking on different tabs on the sidebar to the left of the page. Clicking the **Inbox** link to toggle links for lists provided by default. These include **Today's Tasks**, **Tomorrow's Tasks**, **All Tasks**, and **Completed Tasks**. Users can also click on **Lists** to see a dropdown of custom lists or **Priority** to view a dropdown of lists which organize tasks according to the priority that the user has set for any given task.

<< [Maybe add picture of side bar with list menu dropdown?] >>

If the user would like to create a custom list to further organize their tasks, there is a **+** icon on the left side bar on the page that allows them to do so. Clicking on the icon will initialize a pop-up that prompts the user to enter a list name. Once the user hits the **Add** button, they will be taken to the new list and can begin adding tasks to the list.

Custom lists can be further edited. When hovering over an individual list name, an icon will show up to the right side of the list. When clicked, the user will be provided options to delete or rename the list. If the user chooses to delete the list, all tasks associated with that list will also be removed.

<< [INSERT PICTURE OF THE ADD BUTTON AND THE POP UP] >>

## Creating Tasks and Editing Task Information

Tasks can be edited individually or bulk edited from the task bar, which is the row of icons at the top of the task container. User can select one or more tasks by checking off tasks and clicking on icons that will mark them complete, postpone the deadline by up to five days, set the deadline further into the future, change the list in which the task(s) belong, and delete the task(s).

INSERT PICTURE OF TASK OPTION BAR

Individual tasks can also be edited by selecting the task from the list. A task summary will slide out to the right side of the screen and offer options to rename the task, edit the deadline, priority, or description, and move them to new or existing lists. Each change to a task is updated dynamically and will be saved to the database as soon as the user clicks a dropdown option or moves their mouse focus away from an input. The webpage will also display the updated information immediately.

## Local Installation

The project requires Node.js, NPM, and PostgreSQL and can be installed locally by downloading the repo, creating a PostgreSQL database user with database creation authority, a PostgreSQL database, then saving the credentials to a .env file based on the .env.example file provided in the repo.

Then, run the following within the root directory in order to start the running To Moo List on a local server:

```
npm install 
npm start
```
Migrate and run the seeder files for the database using:
```
npx dotenv sequelize db:migrate
npx dotenv sequelize db:seed:all
```
Note that the seeder files are necessary for populating the default priorities available to tasks: High, Medium, and Low.

From there, a new account can be created and be used to sign in.

## Future Features

## Technical implementation details
Anything you had to stop and think about before building
Descriptions of particular challenges
Snippets or links to see code for these
