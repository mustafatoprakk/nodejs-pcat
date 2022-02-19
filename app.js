const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');
const ejs = require('ejs');
const fs=require("fs")
const Photo = require('./models/Photos');

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
app.use(fileUpload());

// anasayfada db deki verileri getiriyor
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort("-dateCreated"); // sort -> tersten sıralar
  res.render('index', { photos });
});
// tıklanan resmin bilgilerini gönderiyor
app.get('/photos/:id', async (req, res) => {
  //console.log(req.params.id)
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
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
  //await Photo.create(req.body);

  const uploadDir="public/uploads"
  if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir)
  }

  let uploadedImage = req.files.image; // get image
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name; // yeni bir klasör yolu oluşturdum

  // image ve data kaydedeceği yeri gösteriyorum
  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,      // datayı al ve birde image de al
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/'); // yönlendirme
  });
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server started ${port} of port`);
});
