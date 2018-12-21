const express = require('express')
const path = require('path');
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')

//Passport Config
require('./config/passport')(passport);

const app = express();

//Load Routes
const auth = require('./routes/auth')


//Handlebars Middlewares
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.render('index/dashboard')
})

//Use Routes
app.use('/auth',auth);

const PORT = process.env.PORT || 1708;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`)
})