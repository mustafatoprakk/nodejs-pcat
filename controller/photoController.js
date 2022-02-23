const Photo = require('../models/Photos');
const fs = require('fs');

exports.getAllDatas = async (req, res) => {
  const page = req.query.page || 1;
  const photoPerPage = 6;
  const totalPhotos = await Photo.find().countDocuments();

  const photos = await Photo.find({})
    .sort('-dateCreated') // sort -> tersten sıralar
    .skip((page - 1) * photoPerPage) // 2. sayfada 1 ve 2. fotoğrafı geç 3 ten başla
    .limit(photoPerPage);

  res.render('index', {
    photos: photos,
    current: page,
    pages: Math.ceil(totalPhotos / photoPerPage), // 5 tane fotoğraf varsa 1 yukarıya yuvarla
  });
};

exports.getData = async (req, res) => {
  //console.log(req.params.id)
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

exports.createData = async (req, res) => {
  // async kayıt olana kadar bekleyecek
  //await Photo.create(req.body);

  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image; // get image
  let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name; // yeni bir klasör yolu oluşturdum

  // image ve data kaydedeceği yeri gösteriyorum
  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body, // datayı al ve  image de al
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/'); // yönlendirme
  });
};

exports.updateData = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.desc = req.body.desc;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deleteData = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deleteImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deleteImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
