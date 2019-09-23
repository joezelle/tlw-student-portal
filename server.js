const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = 'mongodb+srv://admin:admin@tlw-xus4c.mongodb.net/tlw';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB Connected'));

const port = process.env.PORT || 9000;
const server = app.listen(port, 'localhost', () => {
  console.log(`App running on port ${port}...`);
});
