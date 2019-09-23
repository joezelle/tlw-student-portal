const express = require('express');

const Registration = require('../models/registration');
const EmailHandler = require('../utils/emailHandler');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('register');
});

router.post('/', async (req, res) => {
  const registration = await Registration.create(req.body);
  await new EmailHandler(
    registration.email,
    registration.name
  ).sendRegistered();
  console.log('sent');
  res.redirect('back');
});

module.exports = router;
