const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connect DB
mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//create Schema
const PhotoSchema = new Schema({
  title: String,
  desc: String,
});

const Photo = mongoose.model('Photos', PhotoSchema);

//create photo
// Photo.create({
//   title: 'Photo title 2',
//   desc: 'Photo description 2',
// });

// read photo
// Photo.find({}, (err, data) => {
//   console.log(data);
// });

//update photo
const id = '620cedcfd137e17b8691df3f';
// Photo.findOneAndUpdate(id, { title: 'title updatedd' }, (err, data) => {
//   console.log(data);
// });

Photo.findByIdAndDelete(id, (err, data) => {
    console.log("photo deleted")
})
