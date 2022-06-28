import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { registrationValidation, loginValidation } from './validations/auth.js';
import checkAuth from './middleware/checkAuth.js';
import { reg, log, profile, allUsers } from './controllers/userController.js';
import validationErrors from './middleware/validationErrors.js';

mongoose
.connect('mongodb+srv://ildar:1q2w3e@cluster0.l1ub1.mongodb.net/people?retryWrites=true&w=majority')
.then(() => console.log('Connect DB'))
.catch((err) => console.log('DB not connected', err));

const PORT = process.env.PORT || 5000;

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/login', loginValidation, validationErrors, log);
app.post('/registration', registrationValidation, validationErrors, reg);
app.get('/account', checkAuth, profile);

app.get('/people', allUsers);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(PORT, (err) => {
  if(err) {
    return console.log(err);
  }
  console.log('Server started');
});
