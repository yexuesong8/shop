export default {
  // 指令的定义
  componentUpdated: function(el, binding) {
    if (binding.value !== false) {
      const odiv = el; // 获取当前元素
      const mainDom = getAppMain(odiv);
      const topHeight = window.innerHeight - (mainDom ? mainDom.clientHeight : 0);
      const height = window.innerHeight - topHeight - odiv.getBoundingClientRect().top;
      odiv.style.maxHeight = `${height}px`;
      odiv.style.overflowY = "auto";
      const bodyDom = odiv.querySelector('.el-table__body-wrapper');
      const headDom = odiv.querySelector('.el-table__header-wrapper');
      const footerDom = odiv.querySelector('.el-table__footer-wrapper'); // 合计footer
      const footerHeght = footerDom ? (footerDom.offsetHeight + 10) : 0;
      // 表格body内容
      bodyDom.style.maxHeight = `${height - headDom.offsetHeight - footerHeght - 2}px`;
      bodyDom.style.overflowY = "auto";
    }
    function getAppMain(odiv) {
      let d = odiv;
      let j = null;
      let flag = true;
      while (flag) {
        if (d && d.className !== "app-main") {
          d = d.parentNode;
        } else {
          flag = false;
          j = d;
        }
      }
      return j;
    }
  },
};

