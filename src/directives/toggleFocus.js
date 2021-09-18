const ary = [];
const datePicker = [];

function vueinstance(children) {
  if (!children) return;
  children.forEach(item => {
    if (item.$el.className.indexOf('el-form-item') > -1) {
      ary.push(item.$children[1]);
    } else {
      vueinstance(item.$children);
    }
  });
}

export default {
  bind(el, binding, vnode) {
    const children = el.elements;
    /** 自动聚焦第一个表单元素 */
    // children[0].autofocus = true;
    const elements = Array.from(children);
    vueinstance(vnode.componentInstance.$children);
    ary.forEach(item => {
      if (item.$el.className.indexOf('el-date-editor') > -1) {
        datePicker.push(item);
      }
    });

    elements.forEach((elem, i) => {
      ['onkeypress', 'onkeydown'].forEach(eventName => {
        elem[eventName] = function(ev) {
          if (ev.keyCode === 13) {
            ev.preventDefault();
            ev.returnValue = false;
            ev.stopPropagation();
            return false;
          }
        };
      });

      elem.addEventListener('keyup', function(event) {
        const keyCode = event.keyCode;
        let index = elements.findIndex(item => item === elem);
        if (index === -1) return;
        if (keyCode === 13) {
          event.preventDefault();
          event.stopPropagation();
          event.returnValue = false;
          datePicker.forEach(item => {
            item.pickerVisible && (item.pickerVisible = false);
          });
          elements[index].blur();
          index = (index === elements.length - 1) ? 0 : index + 1;
          elements[index].focus();
          return false;
        }
      }, null);
    });
  },
};
