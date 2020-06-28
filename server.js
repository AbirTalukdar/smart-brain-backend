const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');

 const db = knex ({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '24308',
      database : 'smart_brain'
    }
  });

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'john',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '789',
            hash:'',
            email: 'john@gmail.com'
        }
    ]
}


app.get('/', (req,res) => {
    res.send(database.users);
})
app.post('/signin', (req,res)=>{
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json('success');
    } else{
        res.status(400).json('Error loging in...');
    }
    
})

app.post('/register', (req,res)=>{
    const{name, email, password} = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        
    });
    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    })
    .then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('Unable to Join'))
});
app.get('/profile/:id', (req,res)=>{
    const{ id } = req.params;
    db.select('*').from('users').where({
        id:id
    })
    .then(user => {
        if(user.length){
            res.json(user[0]);
        } else{
            res.status(400).json('Not Found')
        }
    })
    .catch(err => res.status(400).json("Not Found"))
    // if(!found){
    //     res.status(400).json('not found');
    // }
})
app.put('/image', (req,res)=> {
    let found = false;
    const{ id } = req.body;
    database.users.forEach(user =>{
        if(user.id === id){
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if(!found){
        res.status(400).json('not found');
    }
})


// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });
app.listen(4000,  () =>{
    console.log('Smart Brain Backend Server Has Started!!!!');
})