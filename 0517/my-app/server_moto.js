const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 
const mysql = require('mysql')
const { S3, ListObjectsCommand ,GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs')
const path = require('path')
const { render } = require('ejs');
const DynamoDBStore = require('connect-dynamodb')({session: session})
const client = new S3()

app.post("/top", (req,res)=>{
  id =req.body.mozi1;
  pass =  req.body.mozi2;
  const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'mydb'
  });
  connection.connect((err) =>{
    if(err)throw err
  })
  connection.query('SELECT * FROM users', (err, results) =>{
    if (err){
      throw err
    }
    if (results){
      console.log(results);
    }
    var angou = crypto.createHash('sha256').update(pass).digest('hex')
    for (let i=0; i<results.length; ++i){
      if(id==results[i].user_id){
        if(id==results[i].user_id && angou==results[i].password){
          res.render('index.ejs',{name:"hi! "+ results[i].name})
       }else{
        res.render('hoge.ejs',{name: "違います"});
       }
      }
    }
  })
  connection.end()
});

app.listen(8080);
