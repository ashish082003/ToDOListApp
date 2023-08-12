const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


const app = express();



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todoList!"
});

const item2 = new Item({
    name: "Hit the + button to aff a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);



app.get("/", (req, res) => {

    Item.find({}).then(function (foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems).then(function () {
                console.log("Sucessfully saved");
            }).catch(function (err) {
                console.log(err);
            });
        } else {
            res.render("list", {
                listTitle: "Today",
                newListItems: foundItems
            });
        }
    }).catch(function (err) {
        console.log(err);
    });

});

app.get("/:customListName", function (req, res) {
    const customListName = (req.params.customListName);

    List.findOne({ name: customListName }).then(function (err, foundList) {
        if (!err) {
            if (!foundList) {
                //Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);

            } else {
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
        }
    });



});
app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    });
    item.save();

    res.redirect("/");
});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId).then(function () {
        console.log("sucessfully deleted checked item.");
        res.redirect("/");
    }).catch(function (err) {
        console.log(err);
    })
});

app.get("/work", (req, res) => {
    res.render("list", {
        listTitle: "Work list",
        newListItems: workItems
    });
});



app.listen(3000, () => {
    console.log("Server is on port 3000");
});