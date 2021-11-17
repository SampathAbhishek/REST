const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB',{useNewUrlParser:true});
const articleSchema = mongoose.Schema({
  title:String,
  content:String
});
const Article = mongoose.model("Article",articleSchema);

/**********Requests Targeting all articles **************/
app.route("/articles").get(function(req,res){
  Article.find(function(err,foundArticles){
    if(!err)
    {
      res.send(foundArticles);
    }
    else
    {
      res.send(err);
    }
  });
})
.post(function(req,res)
{
    const newArticle = new Article({
      title:req.body.title,
      content:req.body.content
    });
    newArticle.save(function(err)
  {
    if(!err){
      res.send("Succesfully added a new article.");
    }
    else{
      res.send(err);
    }
  });
})
.delete(function(req,res){
  Article.deleteMany({title:'jact Bauer'},function(err)
{
  if(!err){
    res.send("Deleted from mongoDB database successfully.");
  }
  else{
    res.send(err);
  }
})
});
/********************Requests targeting a specific article*****/
app.route("/articles/:token")
.get(function(req,res)
{
    Article.findOne({title:req.params.token},function(err,foundArticle)
    {
      if(!err){
        if(foundArticle){
          res.send(foundArticle);
        }
        else{
          res.send("No articles matching that title");
        }
      }
    });
})
.put(function(req,res)
{
  Article.update(
    {title:req.params.token},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("Succesfully updated Article.");
      }
      else{
        res.send(err);
      }
    }
  );
})
.patch(function(req,res)
{
  Article.update(
    {title:req.params.token},
    {$set:req.body},
    function(err)
    {
      if(!err){
        res.send("Succesfully updated Article.");
      }
      else{
        res.send(err);
      }
    }

  );
})
.delete(function(req,res)
{
  Article.deleteOne(
    {title:req.params.token},
    function(err)
    {
      if(!err){
        res.send("Succesfully deleted Article.");
      }
      else{
        res.send(err);
      }
    }
  );
});


app.listen(3000,function()
{
  console.log("Server is up and running!...");
})
