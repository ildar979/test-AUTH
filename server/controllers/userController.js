import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.js';

export const reg = async(req, res) => {
  try {   
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const doc = new UserModel({
      name: req.body.name,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
      // bornDate: req.body.bornDate,
      // male: req.body.male,
      passwordHash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
      _id: user._id,
      }, 'secretKey',
      {
        expiresIn: '1d',
      },  
    );

    res.json({
      ...user._doc,
      token
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const log = async(req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if(!user) {
      return res.status(400).json({
        message: 'Неверный логиг или пароль',
      });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    
    if(!isValidPassword) {
      return res.status(400).json({
        message: 'Неверный логиг или пароль',
      });
    }

    const token = jwt.sign(
      {
      _id: user._id,
      }, 'secretKey',
      {
        expiresIn: '1d',
      },  
    );
    res.json({
      ...user._doc,
      token
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const profile = async(req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if(!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      })
    }
    res.json(userData);
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};

export const allUsers = async(req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
     console.log(error);
     res.status(500).json({
      message: 'Не удалось получить юзеров',
     });
  }
};
