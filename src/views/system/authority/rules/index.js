import AuthorityRules from "./index.vue";

AuthorityRules.install = function(Vue) {
  Vue.component(AuthorityRules.name, AuthorityRules);
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AuthorityRules.name, AuthorityRules);
}

export default AuthorityRules;
