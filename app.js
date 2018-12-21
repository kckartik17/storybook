const express = require('express')
const path = require('path');
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')

//Load User model
require('./models/users')

//Load Stories model
require('./models/stories')

//Passport Config
require('./config/passport')(passport);

const app = express();

//Load Routes
const auth = require('./routes/auth')
const index = require('./routes/index')
const stories = require('./routes/stories')

//Load keys
const keys = require('./config/keys')

// Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

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
app.engine('handlebars', exphbs({helpers: {
  truncate: truncate,
  stripTags: stripTags,
  formatDate:formatDate,
  select:select,
  editIcon: editIcon
}, defaultLayout: 'main' }));
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

//Set Global Variables
app.use((req,res,next) => {
  res.locals.user = req.user || null;
  next();
})

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));


//Use Routes
app.use('/',index)
app.use('/auth', auth);
app.use('/stories',stories)


const PORT = process.env.PORT || 1708;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`)
})