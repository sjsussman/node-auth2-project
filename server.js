const express = require('express');

const userRouter = require('./routing/userRouter');

const server = express();

server.use(express.json());
server.use('/api', userRouter);

module.exports = server;