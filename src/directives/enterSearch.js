const handleKeyUpSearch = (e, fn) => {
  if (e.keyCode === 13 && fn) {
    fn();
  }
};

export default {
  bind(el, binding, vnode) {
    const { value: fn } = binding;
    el.addEventListener("keyup", (e) => {
      e.stopPropagation();
      e.preventDefault();
      handleKeyUpSearch(e, fn);
    }, null);
  },
  unbind(el, binding) {
    const { value: fn } = binding;
    el.removeEventListener("keyup", (e) => {
      handleKeyUpSearch(e, fn);
    }, null);
  },
};
