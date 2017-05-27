# Brief Report of Assignment 2

## Back end structure

### Database

We choose MongDB as our database.

### Software architecture pattern

We use Model-View-Controller (MVC) as the architecture of our project. The structure is as follows:

* Model - `app/models/db.js` and `app/models/revision.js` managed data, logic and rules of the application. It retrieves data from MongoDB according to _controller_'s commands.

* View - `app/views/index.pug` is the view of this application. It defines how present this application using Jade.

* Controller - `app/controllers/app.server.controller.js`. It accepts input and converts it to commands for the model or view.

In addition, there is a middleware in our backend, the router. We use `app/routes/app.server.routes.js` to help use locating specific controller behaviour.

In our project, when opening the webpage, the application receives request `/`, the router will recieve it and handle it to the `showIndex` controller. The `showIndex` will send commands to _Model_ and _View_, the model will retrive requested data (most revised articles, least revised articles, all articles name, article with shortest history, article with longest history, etc) and send it back to controller, and meanwhile controller will use these data to render view. (This is how the basic thing work, not the AJAX) 

## Front end structure

Besides _View_ part of MVC, we use javascript and css to help us rendering the webpage and use AJAX to update webpage asynchronously.

### How Ajax works

The Ajax works for chart update and individual data.

There are two asynchronos requests made by Ajax.

1. request chart data used by overall when the page is loaded

2. query, check, update, and present the individual data and chart when the selected article is submitted.
