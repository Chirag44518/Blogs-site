//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require('dotenv').config();


const homeStartingContent = "Start composing your blogs.....";
const aboutContent = "Welcome!!! You can use your blog to write about your daily life, your hobbies, your travels, what you're reading, your thoughts and opinions. You can also use it to publish your stories and poems.";
const contactContent = "Follow me on: https://github.com/Chirag44518";

const app = express();

const url=process.env.ATLAS_URL;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));


app.get("/home", function(req, res) {

  Post.find({}, function(err, foundPost) {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: foundPost
      });
    }

  });

});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);


app.post("/compose", function(req, res) {

  const post1 = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post1.save(function(err) {
    if(!err){
    res.redirect("/home");
}
  });
});

app.get("/posts/:postId", function(req, res) {
  const requestedId= req.params.postId;

  Post.findOne({_id: requestedId}, function(err, foundPost){
if(!err)
 {
   res.render("post", {
        title: foundPost.title,
        content: foundPost.content,
        id:requestedId
      });
    }
  });
});

//------------------------------------------------------------------------------------------------------------

  app.get("/posts/update/:postId", function(req, res) {
    const requestedId= req.params.postId;
  
    Post.findOne({_id: requestedId}, function(err, foundPost){
  if(!err)
   {
     res.render("update", {
          title: foundPost.title,
          content: foundPost.content,
          id:requestedId
        });
      }
    });

});


app.post("/posts/update/log", function(req, res) {

  const requestedId= req.body.postId;

  Post.findOneAndUpdate(
      {_id: requestedId},
      {title: req.body.postTitle, content: req.body.postBody},
       {overwrite: true},
    function(err) {
      if (!err) {
        res.render("post", {
          title: req.body.postTitle,
          content: req.body.postBody,
          id:requestedId
        });
      }
    }
  );
  });



// app.post("/delete", function(req, res){
//   const checkedItemId = req.body.checkbox;
//   const listName = req.body.listName;

//   if (listName === "Today") {
//     Item.findByIdAndRemove(checkedItemId, function(err){
//       if (!err) {
//         console.log("Successfully deleted checked item.");
//         res.redirect("/");
//       }
//     });
//   } else {
//     List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
//       if (!err){
//         res.redirect("/" + listName);
//       }
//     });
//   }
// });


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server has started successfully");
});