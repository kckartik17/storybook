const express = require('express')
const path = require('path');
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')

//Load User model
require('./models/user')

//Passport Config
require('./config/passport')(passport);

const app = express();

//Load Routes
const auth = require('./routes/auth')

//Load keys
const keys = require('./config/keys')

//Mongoose Connect
mongoose.connect('mongodb://localhost/storybook', {
  useNewUrlParser: true
})
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch(() => {
    console.log('Error in connecting MongoDB')
  })


//Handlebars Middlewares
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.render('index/dashboard')
})

//Use Routes
app.use('/auth', auth);


const PORT = process.env.PORT || 1708;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`)
})