const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
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
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

// anasayfada db deki verileri getiriyor
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated'); // sort -> tersten sıralar
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

// save data
app.post('/photos', async (req, res) => {
  // async kayıt olana kadar bekleyecek
  //await Photo.create(req.body);

  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image; // get image
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name; // yeni bir klasör yolu oluşturdum

  // image ve data kaydedeceği yeri gösteriyorum
  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body, // datayı al ve  image de al
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/'); // yönlendirme
  });
});

// go to edit page as id
app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', { photo });
});
// update
app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.desc = req.body.desc;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
});

// delete
app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deleteImage = __dirname + '/public' + photo.image;
  fs.unlinkSync(deleteImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server started ${port} of port`);
});
