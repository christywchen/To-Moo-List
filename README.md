# To Moo List

Web Link: [To-Moo-List](http://to-moo-list.herokuapp.com/)

Insert picture of home page here

# Summary

## General Summary

To-moo-list is a clone of another web application called [Remember the Milk](https://www.rememberthemilk.com), but with our own twist. This website application is a **online to-do app** to help you stay organized and help remember your tasks/errands.

## Overall Structure

**Back End**
This app was built using **JavaScript** on the backend with a **postgreSQL** database. Back end structure is **RESTful** and all the data request uses fetch and other promise functions to retrieve/update/delete data from the database.

**Front End**
The front end is built with HTML template called [pug](https://pugjs.org/api/getting-started.html), JavaScript and gets the styling from a normal **CSS** file.

**Libraries**
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
User authentication is handled in JavaScript using BCrypt for hashing passwords. The passwords are not saved to the data, but only the hash versions of them. When the user logs in, the password they provide are rehashed to see if the match the one with the data base to verify the users credentials. 

INSERT LOGIN PAGE PICTURE HERE

## Dashboard Page
This page is where the magic happens. After the user's credentials have been confirmed, the users can access the dashboard page and start creating their own tasks as their reminder application.

INSERT PICTURE OF DASHBOARD PAGE

## Adding Tasks
Users can add task first clicking on the **input bar** at the top middle of the page and type the task they want to add. Once the user types something into the  input bar, the **moo** button should appear to finally add the task. If the user doesn't want to click it, they can also add the task by pressing the **Enter key** on their keyboard to add the task as well.

INSERT PICTURE OF INPUT TASK BAR

## Navigating Lists & Creating/Adding Lists
To navigate through different list category, the users can access them by clicking on different tabs, which is located on the left side of the page. In order for the users to first see different lists, they must first click the tab called **Inbox** **Lists** or **Priorities** and a drop down of the lists that currently there will appear.

[Maybe add picture of side bar with list menu dropdown?]

Also if the user would like to create a new list for your task category there is a **+** sign on the left side bar on the page. Although a bit small, once you click on the + sign, the website should prompt the users to enter a list name and an **Add** button at the bottom once the user is ready to create another list.

[INSERT PICTURE OF THE ADD BUTTON AND THE POP UP]

## Editing Individual Task Information

INSERT PICTURE OF TASK OPTION BAR
