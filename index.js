var express = require('express');
var app = express();
var ejs = require('ejs')
var path = require('path')
const crypto = require('crypto');
const hashingPassword = crypto.createHmac('sha256','password')
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.set('view engine','ejs')
const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";

app.get('/',function(req,res){
  res.sendFile(__dirname+"/home.html");
})
app.get('/register',function(req,res){
  res.sendFile(__dirname+"/register.html");
})
app.get('/login',function(req,res){
  res.sendFile(__dirname+"/login.html");
})
app.get('/donor',function(req,res){
  res.sendFile(__dirname+"/views/donor.ejs");
})
app.get('/donorResponse',function(req,res){
  res.sendFile(__dirname+"/donorResponse.html");
})
app.get('/profile',function(req,res){
  res.sendFile(__dirname+"/profile.html");
})
// app.get("/logout", function (req, res) {
//   req.logout();
//   res.sendFile(__dirname+"/home.html");
// });

app.post("/register",function(req,res){
  const name = req.body.username;
  const email = req.body.email;
  var pass = req.body.password_1;
  var domain = req.body.domain;
  
  MongoClient.connect(url,function(err,db){
    if(err) throw err;
    myDatabase = db.db('FoodWebsite');
    
    myDatabase.collection('User_Details').findOne({"UserName":name},function(err,result){
      if (err) throw err
      if (result !== undefined) {
        console.log("User name Already exists");
        res.redirect("/register");           
      }
      else { 
        const password = hashingPassword.update(pass).digest('hex');
        myData = {"UserName": name ,"Email": email,"Password": password,"Domain":domain};
        myDatabase.collection('User_Details').insertOne(myData,function(err){
          if (err) throw err
          console.log("Document inserted");
          res.redirect("/login");
          db.close            
        }) 
      }
    })
  });
})
app.post("/login", (req,res)=>{
  var username = req.body.username;
  var password = req.body.password;
  var encrytedPassword=crypto.createHmac('sha256','password').update(password).digest('hex')
  console.log(encrytedPassword)
  MongoClient.connect(url,function(err,db){
  myDatabase = db.db('FoodWebsite');
  myDatabase.collection('User_Details').findOne({"UserName":username}).then(user=>{
    if (user && user.Password === encrytedPassword){
      if (user.Domain === "donor"){
        res.render('donor',{
          Donorname : user.UserName
        });
       
      }
      else if (user.Domain === "receiver"){
        res.render('receiver',{
          dispName : user.UserName
        });
      }
    }
    else {
  console.log("Your account or password is incorrect, Please try again or contact your system administrator!");
  res.redirect("/login");  
}}).catch(err => {
  console.log(err);
  
});
})});


app.get("/foodAvailable",(req,res)=>{
  MongoClient.connect(url,function(err,db){
    myDatabase = db.db('FoodWebsite');
    myDatabase.collection('DonorDetails').find({}).toArray(function(err,result){
      res.render('foodAvailable',{
        foodAvailable : result
      })

    })
     })
  })

app.post("/donor",function(req,res){
  const Name = req.body.uName;
  const HotelName = req.body.name;
  const address = req.body.address;
  var number = req.body.contact;
  var food = req.body.foodDetails;
  var date = new Date();
  myData = { "UserName":Name,"Name": HotelName ,"Address": address,"Contact_Number": number,"Food_Details":food, "Date":date};
  MongoClient.connect(url,function(err,db){
    myDatabase = db.db('FoodWebsite');
    myDatabase.collection('User_Details').updateOne({"UserName": Name},{$set :{"Details":myData}},function(err){
          if (err) throw err
          console.log("Document updated");
          db.close            
        })
    myDatabase.collection('DonorDetails').insertOne(myData,function(err){
          if (err) throw err
          console.log("Document inserted");
          db.close            
        })
})
})

// app.post('/donorResponse',(req,res)=>{
//   var username = req.body.uName;
//   MongoClient.connect(url,function(err,db){
//     myDatabase = db.db('FoodWebsite');
//     myDatabase.collection('User_Details').findOne({"UserName":username}).then(user=>{
//       if (user.Status === "Accept"){
//       res.render('donorResponse',{
//         output : true
//       });
//     }
//       else {
//         res.render('donorResponse',{
//           output : false
//         });
        
//       }
//      })
//   })
// })

app.post('/acceptOrder', function(req, res) {
  var name = req.body.DonorName;
  MongoClient.connect(url,function(err,db){
    myDatabase = db.db('FoodWebsite');
    myDatabase.collection('User_Details').updateOne({"UserName": name},{$set :{"Status":"Accept"}},function(err){
          if (err) throw err
          console.log("Document updated");
          db.close            
        })
      })
      res.redirect('/foodAvailable');
 
});



app.listen(3001,()=>{
  console.log("Server started");
});