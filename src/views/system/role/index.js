import Role from "./index.vue";

Role.install = function(Vue) {
  Vue.component(Role.name, Role);
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(Role.name, Role);
}

export default Role;
