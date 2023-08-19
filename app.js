//connection string to put in the command line => mongosh "mongodb+srv://cluster0.wtywmfw.mongodb.net/" --apiVersion 1 --username ayushiarya599
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT= process.env.PORT || 3000;
// if(PORT == null || PORT == ""){
//   PORT = 3000;
// }

// var householdItems = [];
// var workItems =[];
// var groceryItems =[];
//instead of storing items in array, we use mongodb to store data
//create todolistDB database

mongoose.connect("mongodb+srv://ayushiarya599:Symbol%4010@cluster0.wtywmfw.mongodb.net/todolistDB?retryWrites=true", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// mongoose.connect("mongodb+srv://ayushiarya599:Symbol@10@cluster0.wtywmfw.mongodb.net/todolistDB", {
//   useNewUrlParser: true,
// });

// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {
//   useNewUrlParser: true,
// });

//defining schema for documents that will get stored in any collections inside this database
const itemsSchema = {
  name: {
    type: String,
    required: true,
  },
};

//defining 3 collections: homes, works, groceries inside todolistDB
const Home = mongoose.model("Home", itemsSchema);
const Work = mongoose.model("Work", itemsSchema);
const Grocery = mongoose.model("Grocery", itemsSchema);

//defining default documents to populate the homes collection
const cook = new Home({
  name: "Cook pasta",
});
const clean = new Home({
  name: "Clean the kitchen",
});
const water = new Home({
  name: "Water the plants",
});

//creating an array of above documents to be inserted in homes collection
const defaultHouseholdItems = [cook, clean, water];

//code to delete all documents in home collection
// Home.deleteMany({ name: { $exists: true } })
//   .then(function (result) {
//     console.log(
//       result,
//       "Successfully deleted household items from home todo list"
//     );
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

// //code to insert all default documents in homes collection
// Home.insertMany(defaultHouseholdItems)
//   .then(function (result) {
//     console.log(result, "Successfully saved household items to home todo list");
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

//defining default documents to populate the works collection
const read = new Work({
  name: "Read Docs",
});
const write = new Work({
  name: "Write about the action plan for next week",
});
const listen = new Work({
  name: "Listen to the finance podcast",
});
const defaultWorkItems = [read, write, listen];
Work.deleteMany({ name: { $exists: true } })
  .then(function (result) {
    console.log(
      result,
      "Successfully deleted household items from work todo list"
    );
  })
  .catch(function (err) {
    console.log(err);
  });
// // Work.createIndexes({ "name": 1 }, { unique: true });
// Work.insertMany(defaultWorkItems)
//   .then(function (result) {
//     console.log(result, "Successfully saved household items to work todo list");
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

//defining default documents to populate the groceries collection
const mop = new Grocery({
  name: "Buy mop for balcony",
});
const milk = new Grocery({
  name: "get milk for custard",
});
const broccoli = new Grocery({
  name: "buy broccoli for fried rice",
});
const defaultGroceryItems = [mop, milk, broccoli];
// Grocery.deleteMany({ name: { $exists: true } })
//   .then(function (result) {
//     console.log(
//       result,
//       "Successfully deleted household items from Grocery todo list"
//     );
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

// // Grocery.createIndexes({ name: 1 }, { unique: true });
// Grocery.insertMany(defaultGroceryItems)
//   .then(function (result) {
//     console.log(
//       result,
//       "Successfully saved household items to grocery todo list"
//     );
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

app.get("/", function (req, res) {

  let day = date.getDate();

  Home.find()
    .then(function (householdItems) {

      if (householdItems.length === 0) {

        Home.insertMany(defaultHouseholdItems)
          .then(function (result) {
            console.log(
              result,
              "Successfully saved household items to home todo list"
            );
          })
          .catch(function (err) {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("list", {
          listType: "Home",
          kindOfDay: day,
          newListItems: householdItems,
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/work", function (req, res) {
  let day = date.getDate();
  Work.find()
    .then(function (workItems) {
      if (workItems.length === 0) {
        Work.insertMany(defaultWorkItems)
          .then(function (result) {
            console.log(
              result,
              "Successfully saved household items to work todo list"
            );
          })
          .catch(function (err) {
            console.log(err);
          });
        res.redirect("/work");
      } else {
        res.render("list", {
          listType: "Work",
          kindOfDay: day,
          newListItems: workItems,
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/grocery", function (req, res) {
  let day = date.getDate();
  Grocery.find()
    .then(function (groceryItems) {
      if (groceryItems.length === 0) {
        Grocery.insertMany(defaultGroceryItems)
          .then(function (result) {
            console.log(
              result,
              "Successfully saved household items to grocery todo list"
            );
          })
          .catch(function (err) {
            console.log(err);
          });
        res.redirect("/grocery");
      } else {
        res.render("list", {
          listType: "Grocery",
          kindOfDay: day,
          newListItems: groceryItems,
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  if (req.body.list == "Home") {
    const newItem = new Home({
      name: itemName,
    });
    newItem.save();
    res.redirect("/");
  } else if (req.body.list === "Work") {
    const newItem = new Work({
      name: itemName,
    });
    newItem.save();
    res.redirect("/work");
  } else if (req.body.list === "Grocery") {
    const newItem = new Grocery({
      name: itemName,
    });
    newItem.save();
    res.redirect("/grocery");
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const checkedItemListType = req.body.listName;
  console.log(checkedItemListType);
  console.log(checkedItemId);

  if (checkedItemListType === "Home") {
    Home.findByIdAndRemove(checkedItemId)
      .then(function (result) {
        console.log(result);
      })
      .catch(function (err) {
        console.log(err);
      });
      res.redirect("/");
    }
  if (checkedItemListType === "Work") {
    Work.findByIdAndRemove(checkedItemId)
      .then(function (result) {
        console.log(result);
      })
      .catch(function (err) {
        console.log(err);
      });
      res.redirect("/work");
  }
  if (checkedItemListType === "Grocery") {
    Grocery.findByIdAndRemove(checkedItemId)
      .then(function (result) {
        console.log(result);
      })
      .catch(function (err) {
        console.log(err);
      });
      res.redirect("/grocery");
  }
});

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});

//Set the port for our local application, 3000 is the default
// Call the listen() function, It requires path and callback as an argument. It starts listening to the connection on the specified path, the default host is localhost, and our default path for the local machine is the localhost:3000, here 3000 is the port which we have set earlier. The callback function gets executed either on the successful start of the server or due to an error.

// Now as we have created a server we can successfully start running it to see it’s working, write this command in your terminal to start the express server.
// node app.js
// or nodemon app.js to automatically restart the server upon detecting any changes in code

// Finally, after a successful run if you try to open the URL (localhost:3000) on the browser it will show you cannot GET / because we have not configured any route on this application yet.

// Now we will set all the routes for our application.

// Routes are the endpoints of the server, which are configured on our backend server and whenever someone tries to access those endpoints they respond accordingly to their definition at the backend. If you’re a beginner you can consider route as a function that gets called when someone requests the special path associated with that function and return the expected value as a response. We can create routes for HTTP methods like get, post, put, and so on.

// Syntax: The basic syntax of these types of routes looks like this, the given function will execute when the path and the request method resemble.

// app.anyMethod(path, function)

// Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).

// Each route can have one or more handler functions, which are executed when the route is matched.

// Route definition takes the following structure:

// app.METHOD(PATH, HANDLER)
// Where:

// app is an instance of express.
// METHOD is an HTTP request method, in lowercase.
// PATH is a path on the server.
// HANDLER is the function executed when the route is matched.

// HTTP request methods - HTTP defines methods to indicate the desired action to be performed on the identified resource. What this resource represents, whether pre-existing data or data that is generated dynamically, depends on the implementation of the server. Often, the resource corresponds to a file or the output of an executable residing on the server.

// The GET method requests that the target resource transfer a representation of its state. GET requests should only retrieve data and should have no other effect. For retrieving resources without making changes, GET is preferred over POST, as they can be addressed through a URL. This enables bookmarking and sharing and makes GET responses eligible for caching, which can save bandwidth.

// The POST method requests that the target resource process the representation enclosed in the request according to the semantics of the target resource. For example, it is used for posting a message to an Internet forum, subscribing to a mailing list, or completing an online shopping transaction.

// Setting up a basic get request route on the root URL (‘/’ path) of the server.
// With app.get() we are configuring our first route, it requires two arguments first one is the path and, the second one is a function that will be executed when anyone requests this path with GET method. The express provides the request and response object as a parameter to all such types of functions.
// The req is a giant object which will be received from the user and res is an object which will be sent to the user after the function finishes execution.
// Later we are calling status() method it takes an HTTP status code as an argument and when the response is returned, the status will be sent along.
// Finally, we are returning the response to the user. The send() method takes a string, object, array, or buffer as an argument and is used to send the data object back to the client as an HTTP response, also there are lots of types of response in express like res.json() which is used to send JSON object, res.sendFile() which is used to send a file, etc.

//res.render uses the view engine that we set up here to render a particular page. So in this case we are rendering a page called index and that'll be called an index.ejs page
//in order to use ejs or any other view engine, we first need to create a folder called views and this is where the view engine will go by default and look for the files that you're trying to render.
//inside views folder, we create a list.ejs file and this is going to be the base template to create all of our to do lists. Inside here we will essentially write html code.
//app.js file contains our express code
//npm init creates a nodejs application, because our express server will work inside the node application.
