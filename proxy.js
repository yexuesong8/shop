module.exports = {
  // detail: https://cli.vuejs.org/config/#devserver-proxy
  "/api/v1/rabbit": {
    // target: `http://192.168.10.40:9001`, // rabbit-dev
    target: `http://192.168.10.60:9000`, // dev-service
    // target: `http://192.168.9.95:80`, // xianglanying
    // target: `http://192.168.9.61:8080`, // xiexiaoqin
    // target: `http://192.168.9.187:8080`, // xianghaibiao
    // target: `http://192.168.9.91:20000`,
    changeOrigin: true,
  },
  "/api/v1/fish": {
    target: `http://192.168.10.60:9013`, // dev-service
    // target: `http://192.168.9.91:20000`,
    changeOrigin: true,
  },
  "/api/v1/magpie": {
    target: `http://192.168.10.60:9013/`, // dev-service
    // target: `http://192.168.9.91:20000`,
    changeOrigin: true,
  },
};
