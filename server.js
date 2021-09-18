const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const history = require('connect-history-api-fallback');
const compression = require("compression");

const app = express();
const router = express.Router();

router.get('/', function(req, res, next) {
  req.url = './index.html';
  next();
});

app.use(compression()); // 开启GZIP
app.use(history());
app.use(router);
app.use(express.static(path.join(__dirname, 'dist')));
app.use(proxy('/api', {
  target: "http://192.168.10.40:9000/",
  changeOrigin: true,
}));

module.exports = app.listen("55025", function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + 55025 + '\n');
});
