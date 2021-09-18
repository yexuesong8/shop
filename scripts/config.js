let externals = {};

exports.externals = {
  ...externals,
  'vue': 'vue',
  'element-ui': 'element-ui',
  "@monkey.do/element-ui": "@monkey.do/element-ui",
  '@monkey.do/monkey': '@monkey.do/monkey',
  "vue-router": "vue-router",
  "vuex": "vuex",
  "wangeditor": "wangeditor",
};

exports.pluginExternals = {
  ...externals,
  'vue': 'Vue',
  "vuex": "Vuex",
  "vue-router": "VueRouter",
  'element-ui': 'ELEMENT',
  "@monkey.do/element-ui": "ELEMENT",
  '@monkey.do/monkey': 'Monkey',
  "wangeditor": "wangeditor",
  "Rabbit/utils": "Rabbit",
  "@/entry/lib": "Rabbit",
  "@/utils": "Rabbit",
  "@/components": "Rabbit",
};
