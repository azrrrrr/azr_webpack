const config = require('./config/config.js');
const app = require('./config/express.js');

if (!module.parent) {
  app.listen(config.port, () => {
    console.log(`server started on  post http://127.0.0.1:${config.port} (${config.env})`);
  });
}

module.exports = app;
