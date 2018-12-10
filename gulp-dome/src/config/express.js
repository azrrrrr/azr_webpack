const  express = require('express');
const  config = require('./config');
const  index = require('../server/routes/index.route');

const app = express();

app.get('/', (req, res) => {
  res.send(`server started on  port http://127.0.0.1:${config.port} (${config.env})`);
});

app.use('/api', index);

module.exports = app;
