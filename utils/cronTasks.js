const cron = require('node-cron');

const Registration = require('../models/registration');
const EmailHandler = require('../utils/emailHandler');

cron.schedule('0 0 */3 * * *', async () => {
  const registrations = await Registration.find({ registered: false });
  registrations.forEach(async registration => {
    await new EmailHandler(
      registration.email,
      registration.name,
      registration._id
    ).sendFollowUp();
    registration.registered = true;
    await registration.save();
  });
});
