import { hasPermission } from "@/utils";

function verifyPermission(el, binding) {
  const { value } = binding;
  if (value && !hasPermission(value) && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

export default {
  bind: function(el, binding) {
    verifyPermission(el, binding);
  },
  update: function(el, binding) {
    verifyPermission(el, binding);
  },
};
