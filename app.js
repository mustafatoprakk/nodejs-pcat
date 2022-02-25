const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const ejs = require('ejs');
const photoController = require("./controller/photoController")
const pageController=require("./controller/pageController")

const app = express();

// connect db
mongoose.connect('mongodb+srv://mustafa:m1u2s3t4a5t6@cluster0.mor9p.mongodb.net/pcat-db?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log("db successfuly connected")
}).catch((err)=>{
  console.log(err)
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
app.get('/', photoController.getAllDatas);
// tıklanan resmin bilgilerini alıyor
app.get('/photos/:id', photoController.getData);
app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddDataPage);
// save data, post request
app.post('/photos', photoController.createData);
// go to edit page as id
app.get('/photos/edit/:id', pageController.getDataEditPage);
// update
app.put('/photos/:id', photoController.updateData);
// delete
app.delete('/photos/:id', photoController.deleteData);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started ${port} of port`);
});
