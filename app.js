const express = require('express');
const path = require('path');
const ejs = require('ejs');
const Photo = require('./models/Photos');
const mongoose = require('mongoose');

const app = express();

// connect db
mongoose.connect('mongodb://localhost/pcat-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // url deki datayı okumamızı sağlıyor
app.use(express.json());

// route
app.get('/', async (req, res) => {
  const photos = await Photo.find({});
  res.render('index', { photos });
});
app.get('/photos/:id', async (req, res) => {
  //console.log(req.params.id)
  const photo=await Photo.findById(req.params.id)
  res.render("photo",{
    photo
  })
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});

// post
app.post('/photos', async (req, res) => {
  // async kayıt olana kadar bekleyecek
  Photo.create(req.body);
  res.redirect('/'); // yönlendirme
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server started ${port} of port`);
});
