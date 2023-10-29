const express = require("express")
const pool = require("./dbConfig")
const bcrypt = require("bcrypt")
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json());
const PORT = 8000

app.get("/",(req,res)=>{
    res.json(`Hello World`)
})

app.get("/posts",async(req,res)=>{
    try {
        let posts = await pool.query('SELECT * FROM post where id = $1',[9])
        res.json(posts.rows)
    } catch (error) {
        console.log(error)
    }
})

app.post("/signup",async(req,res)=>{
    try {
        const genSalt = bcrypt.genSaltSync(10)
        const {name,email,password} = req.body
        const hashedPassword = bcrypt.hashSync(password,genSalt)
        const newUser = await pool.query('INSERT INTO profile(name,email,password) VALUES($1,$2,$3)',[name,email,hashedPassword])
        res.json(newUser)
    } catch (error) {
        console.log(error)
    }
})

app.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body
        const user = await pool.query('SELECT * FROM profile WHERE email = $1',[email])
        console.log(user.rows)
        let isTrue = await bcrypt.compare(password,user.rows[1].password)
        res.json({user : user.rows[0] , isTrue})
    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT,()=>console.log(`server started on ${PORT}`))