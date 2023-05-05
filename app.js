const express = require("express");
const cors = require("cors");
const contactsRouter = require("./app/routes/contact.route");
const ApiError = require("./app/api-error");
const bodyParser = require('body-parser');
const AccountModel = require('./app/services/account.service');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());
app.use("/api/contacts", contactsRouter);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to contact book application."});
});
//Create register
app.post('/register', (req, res, next)=> {
    var username = req.body.username
    var password = req.body.password

    AccountModel.findOne({
        username: username
    })
    .then(data => {
        if(data){
            res.json('Nguoi dung da ton tai!');
        }else{
            return AccountModel.create({
                username: username,
                password: password
            })
        }
    })    
    .then(data =>{
        res.json("Tao tai khoan thanh cong");
    })
    .catch(err => {
        res.status(500).json("Tao tai khoan that bai!");
    })
});

//Create login
app.post('/login', (req, res, next) => {
    var username = req.body.username
    var password = req.body.password
    
    AccountModel.findOne({
        username: username,
        password: password
    })
    .then(data =>{
        if(data){
            res.json('Đăng nhập thành công');
        }else{
            res.status(300).json('Tài khoản không đúng!');
        }
    })
    .catch(err =>{
        res.status(500).json('Xay ra loi tren server');
    })
})


// handle 404 response
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => { 
    return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    });
});





module.exports = app;