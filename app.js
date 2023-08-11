const express=require("express");
const mongoose=require("mongoose");
const date = require(__dirname + "/date.js");
const bodyParser=require("body-parser");

const app=express();

let items=[];
let workItems=[];

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
let day=date.getDate();
res.render("list",{
    listTitle:day,
    newListItems:items
});
});

app.post("/",(req,res)=>{
    let item=req.body.newItem;
    if(req.body.button=="Work"){
        workItems.push(item);
        res.redirect("/work");
    }else{
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work",(req,res)=>{
    res.render("list",{
        listTitle:"Work list",
        newListItems:workItems
    });
});

app.listen(3000,()=>{
    console.log("Server is on port 3000");
});