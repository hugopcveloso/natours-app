const _ = require('lodash');
const AppError = require('../utils/AppError');

// Error handler functions
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue);
  const value = Object.values(err.keyValue);
  const message = `Duplicate ${field}: ${value}, Please use another ${field}`;

  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

//SENDING ERRORS DEPENDING ON ENVIRONMENT
const sendErrorDev = (err, res) => {
  console.log(`❌ ${err.stack}`);
  console.log('----------');
  console.log(`${err.status} -> ${err.message}`);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Programming or other unknown error: don't leak error details
    //1)Log Error
    console.error('🔥 ERROR  🔥', err);
    //2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong :/',
    });
  }
};

module.exports = (err, req, res, next) => {
  //error handling middleware
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //sending different errors in dev and prod
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    //We're mutating err (original object) and that's not ideal
    if (err.constructor.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationError(err);
    sendErrorProd(err, res);
  }
};
