function Result() {

}

Result.prototype.success = function(data, message = "操作成功") {
  return {
    statusCode: 600,
    data,
    message,
  };
};

Result.prototype.error = function(data, message = "操作失败", code = 602) {
  return {
    statusCode: code,
    data,
    message,
  };
};

module.exports = new Result();
