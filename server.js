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

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// to connect to a local database we would put
// mongoose.connect(process.env.DATABASE_LOCAL, AND THEN THE SAME AS BELOW>

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true, // Terminal suggestion
  })
  .then(() => console.log('db connection successful'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
