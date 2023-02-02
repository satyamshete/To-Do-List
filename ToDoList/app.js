const bodyParser = require('body-parser');
const express = require ('express');
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash")
var date= require(__dirname + "/date.js") ;



mongoose.connect('mongodb://localhost:27017/todolistDB',
  {
    useNewUrlParser: true
  })

  const itemsSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("Item", itemsSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:"true"}))
app.use(express.static("public"))
// var items = ["Buy Food", "Cook Food", "Eat Food" ];
let workItems = [];
const buyFood = new Item ({name: "Buy Food"})
const cookFood = new Item ({name: "Cook Food"})
const eatFood = new Item ({name: "Eat Food"})

const defaultArray = [buyFood, cookFood,eatFood]



app.get("/", function(req, res){
    // day = date.getDate();

    Item.find(function(err, items) {
        if (err) {
            console.log(err);
        } else {
            if (items.length === 0) {
                Item.insertMany(defaultArray,function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("successfully saved default data in DB");
                    }
                })
                res.redirect("/")
            } else {
                res.render("list", {listTitle: "Today", newListItems: items}) 
            }
        }
    })
   

})
  
app.post("/delete",function (req, res) {
    const deleteItem = req.body.deleteItem;
    const listName = _.capitalize(req.body.listName.toLowerCase())
    if (listName === "Today") {
        Item.deleteOne({_id: deleteItem},function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("sucessfully deleted");
                res.redirect("/")
            }
            
        })
    } else {
        List.findOneAndUpdate({name:listName},{$pull: {items:{_id:deleteItem}}},function(err,lists){
            if (err) {
                console.log(err);
            } else {
                res.redirect("/"+listName)
                // lists.items.deleteOne({_id: deleteItem},function (err) {
                //     if (err) {
                //         console.log(err);
                //     } else {
                //         console.log("sucessfully deleted");
                //         res.redirect("/")
                //     }
                    
                // })
            }
        })
    }
    
    
})

// app.get("/work", function(req, res){
//     res.render("list",{listTitle: "Work List", newListItems: workItems})
// })
// app.post("/work", function(req, res){
//     let item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work")
// })
app.listen(3000, function(){
    console.log("server started on port 3000")
})

const listSchema = mongoose.Schema({
    name: String,
    items: [itemsSchema]
})
const List = mongoose.model("List",listSchema)
app.get("/:customName",function (req, res) {
    const customName = _.capitalize(req.params.customName.toLowerCase())
    List.findOne({name:customName},function(err,lists){
        if (err) {
            console.log(err);
        } else {
            if (!lists) {
                
                const list = new List ({
                    name: customName,
                    items: defaultArray
                })
                list.save()
                res.redirect("/"+customName)
            } else {
                res.render("list",{listTitle: customName, newListItems: lists.items})
                
            }
        }
    })
   
})

// app.post("/:customName",function (req, res) {
//     const customName = req.body.newItem
//     const newItem = new List ({name: customName})
//     List.findOne({name:customName},function(err,list){
//         if (!err) {
//             list.items.push(newItem)
//             list.save()
//             res.redirect("/"+customName)
//             } else {
//                 console.log(err);
//             }
//         })
// })


app.post("/", function(req, res){

    // if (req.body.button === "Work List")
    // { 
    // workItems.push(item)
    // res.redirect("/work");
    // }
    // else 
        if (req.body.button === "Today") {
            const item= new Item ({name:req.body.newItem});
            item.save();
            res.redirect("/");
        }
        else
        {
            const customName = _.capitalize(req.body.button.toLowerCase())
            const newItem = new List ({name: req.body.newItem})
            List.findOne({name:customName},function(err,list){
        if (!err) {
            list.items.push(newItem)
            list.save()
            res.redirect("/"+customName)
            } else {
                console.log(err);
            }
        })

        }
    })