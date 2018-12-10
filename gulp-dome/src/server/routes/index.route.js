const express = require('express');

const  config = require('../../config/config');

const router = express.Router();


router.get('/', (req, res) => {
  res.send(` localhost:${config.port}/api 已经开启`);
});

module.exports = router;
