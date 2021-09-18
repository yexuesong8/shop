const fs = require("fs");
const path = require("path");

const scriptString = `
  <!-- IS_BUILD -->
  ${process.env.RUN_ENV === 'plugin' ? "<script src='/polyfill.min.js'></script>" : ""}
  <script src="/core/vue/vue.min.js"></script>
  <script src="/core/vuex/vuex.min.js"></script>
  <script src="/core/vue-router/vue-router.min.js"></script>
  <script src="/core/element-ui/js/index.js"></script>
  <script src="/core/monkey/js/monkey.min.js"></script>
  <script src="/core/rabbit/js/rabbit.plugin.js"></script>
  <script src="/core/plugins.js"></script>
  <script src="/core/loader.js"></script>
`;

const styleString = `
   <link href="/core/element-ui/css/index.css" rel="stylesheet">
   <link href="/core/monkey/css/index.css" rel="stylesheet">
   <link href="/core/rabbit/css/style.plugin.css" rel="stylesheet">
`;

const htmlPath = path.resolve(__dirname, '../dist/index.html');

fs.readFile(htmlPath, function(err, data) {
  if (!err) {
    let htmlContent = data.toString();
    if (htmlContent.includes("IS_BUILD")) {
      console.log("请重新build:prod后再执行");
      return;
    }

    // 添加script标签
    const array = htmlContent.split("<script>");
    array.splice(0, 1, `${array[0]}${scriptString}`);
    htmlContent = array.join("<script>");

    // 添加css标签
    const cssArray = htmlContent.split("<link");
    cssArray.splice(0, 1, `${cssArray[0]}${styleString}`);
    htmlContent = cssArray.join("<link");

    fs.writeFile(htmlPath, htmlContent, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("HTML写入成功");
      }
    });
  } else {
    console.log(err);
  }
});
