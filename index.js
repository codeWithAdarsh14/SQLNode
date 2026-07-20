const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "Delta_app",
  password: "adarshx4232"
});

let getRandomUser=  ()=> {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
}
// let data=[];
// for(let i=1;i<=100;i++){
//   data.push(getRandomUser());
// }
// let q = `INSERT INTO user(id, username, email, password) VALUES ?`
// try{
//     connection.query(q,[data], (err,result)=>{
//         if(err) throw err;
//         console.log(result);

//     });
// }catch(err){
//     console.log(err);
// }
// connection.end();
let port = 8080;
// HOME ROUTE
app.get("/",(req,res)=>{
  let q  = `SELECT COUNT(*) FROM user`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let count = result[0]["COUNT(*)"]
      res.render("home.ejs", {count});
      console.log(result[0]["COUNT(*)"]);
    });

  }catch(err){
    console.log(err);
    console.log("Some error in DB");
  }
  
});

// SHOW ROUTE
app.get("/user",(req,res)=>{
  let q  = `SELECT * FROM user`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      res.render("showUser.ejs", {result});
    })
  }catch(err){
    console.log(err);
    res.send("Some error occured in DB");
  }
})
// EDIT ROUTE
app.get("/user/:id/edit", (req,res)=>{
  let {id} = req.params;
  let q  = `SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user = result[0];
      res.render("edit.ejs", {user});
      console.log(result);
    })
  }catch(err){
    console.log(err);
    res.send("Some error occured in DB");
  }

});

//UPDATE ROUTE
app.patch("/user/:id", (req,res)=>{
   let {id} = req.params;
   let q= `SELECT * FROM user WHERE id='${id}'`;
   let formPass = req.body.password;
   let newUserName = req.body.username;
   try{
    connection.query(q,(err,result)=>{
      let user = result[0];
      if(formPass!=user.password){
        res.send("Sorry Wrong Password!!");
      }else{
        let q2 = `UPDATE user SET username='${newUserName}' WHERE id='${id}'`;
        try{
          connection.query(q2,(err,result)=>{
            if(err) throw err;
            res.redirect("/user");
          });
        }catch(err){
          console.log(err);
          res.send("Some Error occured in DB");
        }
      }
    })
   }catch(err){
    console.log(err);
    res.send("Some error Occured in DB!!");
   }
})

// ADD USER
app.get("/user/add",(req,res)=>{
  res.render("add.ejs");

});

app.post("/user",(req,res)=>{
  const id = faker.string.uuid();
  let q = `INSERT INTO user (id,username,email,password) VALUES (?, ?, ?, ?)`;
  let newusername = req.body.username;
  let newpassword = req.body.password;
  let newemail = req.body.email;
  let data=[id,newusername,newemail,newpassword];
  try{
    connection.query(q,data,(err,result)=>{
      if(err) throw err;
      res.redirect("/user");
      console.log(res);
    })
  }catch(err){
    console.log(err);
    res.send("Some Error Occuredin DB");
  }
  
})

app.listen(port,()=>{
  console.log(`app is listening on port${port}`);
});


// console.log(getRandomUser());