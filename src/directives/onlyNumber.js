export default {
  bind(el, binding, vnode) {
    const input = el.children[0];
    let reg = /[^\d|\.]/g;
    if (binding.arg) {
      input.maxLength = binding.arg;
    }
    if (binding.value) {
      reg = binding.value;
    }
    input.oninput = function() {
      this.value = this.value.replace(reg, '');
      if (vnode.componentInstance) { // 手动触发双向绑定
        vnode.componentInstance.$emit('input', this.value);
      } else {
        vnode.elm.dispatchEvent(new CustomEvent('input', this.value));
      }
    };
  },

};
