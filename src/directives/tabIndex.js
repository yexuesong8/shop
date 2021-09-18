export default {
  bind(el, binding, vnode) {
    const formItems = el.querySelectorAll(".el-form-item");
    const nodes = [];

    formItems.forEach(item => {
      const itemInput = item.querySelectorAll("input");
      const itemTextarea = item.querySelectorAll("textarea");
      const itemSelect = item.querySelectorAll("select");
      itemInput.forEach(input => {
        nodes.push(input);
      });
      itemTextarea.forEach(textarea => {
        nodes.push(textarea);
      });
      itemSelect.forEach(select => {
        nodes.push(select);
      });
      // nodes = nodes.concat(itemInput.length ? itemInput : [], itemTextarea.length ? itemTextarea : [], itemSelect.length ? itemSelect : []);
    });

    // document.addEventListener("keydown", (e) => {
    //   if (e.code === "Tab") {
    //     // 在最后一个节点处Tab
    //     const curNode = e.target;
    //     if (curNode.isEqualNode(nodes[nodes.length - 1])) {
    //       if (nodes[0]) {
    //         // console.dir(nodes[0]);
    //         // nodes[0].focus();
    //         setTimeout(() => {
    //           nodes[0].focus();
    //         }, 100);
    //       }
    //     }
    //   }
    // }, null);

    let curNode = null;

    document.addEventListener("keydown", (e) => {
      if (e.code === "Tab") {
        // 在最后一个节点处Tab
        curNode = e.target;
      }
    }, null);

    document.addEventListener("keyup", (e) => {
      if (e.code === "Tab") {
        if (curNode.isEqualNode(nodes[nodes.length - 1])) {
          if (nodes[0]) {
            nodes[0].focus();
          }
        }
      }
    }, null);
  },

};
