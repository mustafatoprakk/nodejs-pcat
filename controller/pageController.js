const Photo = require('../models/Photos');

exports.getAboutPage = (req, res) => {
  res.render('about');
};

exports.getAddDataPage = (req, res) => {
  res.render('add');
};

exports.getDataEditPage = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', { photo });
};
