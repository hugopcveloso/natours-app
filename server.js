/* eslint-disable no-console */
const mongoose = require('mongoose');

const dotenv = require('dotenv');

//how to handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION ❌ Shutting down...');
  //we let server finish all process
  process.exit(1); //before we exit
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION ❌ Shutting down...');
  console.log(err.name, err.message, err.stack);
  //we always need to crash the process in a uncaught exception
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const started = new Date();
console.info(`Connecting to Mongoose:     ${started.toLocaleTimeString()}`);
const tm = function (startTime, failVal) {
  var end = new Date() - startTime;
  var fail = end <= failVal ? 'pass' : 'fail';
  return `${new Date().toLocaleTimeString()}: ${end
    .toString()
    .padStart(5, ' ')} ms : ${fail}`;
};

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// to connect to a local database we would put
// mongoose.connect(process.env.DATABASE_LOCAL, AND THEN THE SAME AS BELOW>

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true, // Terminal suggestion
};
mongoose
  .connect(DB, options)
  .then(() => console.log('DB connection successful!  ', tm(started, 20000)));

const port = process.env.PORT || 3000; //we need PORT because of heroku
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
