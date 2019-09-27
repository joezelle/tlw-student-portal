const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const flash = require('connect-flash');
const morgan = require('morgan');
const methodOverride = require('method-override');

require('./utils/cronTasks');

// Import Routes //
const registrationRoutes = require('./routes/register');

const Reg = require('./models/registration')

// Initialize express and use cors
const app = express();
app.use(cors());

app.use(async (req, res, next) => {
  const registrations = await Reg.find({ registered: false });
  console.log(registrations)
  next();
})

// View Engine Setup //
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Configs
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Static Assets Config
app.use(express.static(path.join(__dirname, 'public')));

// Connect flash
app.use(flash());

// Set Global Variables
app.use((req, res, next) => {
  // res.locals
  next();
});

// Development logging
app.use(morgan('dev'));

// Use Routes
app.use('/register', registrationRoutes);
app.use('/', (req, res) => {
  res.send('cool');
});

// Handle Errors

module.exports = app;
