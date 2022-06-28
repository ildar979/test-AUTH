import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен состоять минимум из 6 символов').isLength({ min: 6 }),
];

export const registrationValidation = [
  body('name', 'Укажите имя').isLength({ min: 3 }),
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен состоять минимум из 6 символов').isLength({ min: 6 }),
  body('avatarUrl', 'Некоректная ссылка на аватарку').optional().isURL(),
  // body('bornDate', 'Неверный формат даты').isLength({ min: 6 }),
  // body('male', 'Неверный формат даты').isLength({ min: 3 }),
];
