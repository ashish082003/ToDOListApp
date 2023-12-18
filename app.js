const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const dotenv = require("dotenv");
const app = express();
dotenv.config();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

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
            res.redirect("/");
        }
    }).catch(function (err) {
        console.log(err);
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
