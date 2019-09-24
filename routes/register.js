const express = require('express');

const Registration = require('../models/registration');
const EmailHandler = require('../utils/emailHandler');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('registration/register');
});

router.get('/thank-you', (req, res) => {
  res.render('registration/thank-you');
});

router.post('/', async (req, res) => {
  const registration = await Registration.create(req.body);
  res.redirect('/register/thank-you');
  await new EmailHandler(
    registration.email,
    registration.name
  ).sendRegistered();
});

module.exports = router;
