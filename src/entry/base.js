import Vue from 'vue';
import Element, { Message, Notification, MessageBox, Loading } from "@monkey.do/element-ui";
import Monkey, { parseTime, getLocalStorage } from "@monkey.do/monkey";
import { dictFormatter, resetForm, getImgSrc, hasPermission, request, requestNoToken, api, $request, $mockRequest, mockRequest } from '@/utils';
import { doingConfirm } from '@/components/DoingConfirm';
import * as RabbitComponents from "@/components/index";
import directives from '@/directives';

import '@assets/icons/index'; // icons
import '@assets/styles/index.scss'; // global rabbit css

// 注册全局api
const requireAll = requireContext => requireContext.keys().map(requireContext);
const apis = requireAll(require.context("@/api", true, /\.js$/));
api.install(apis);

Vue.prototype.dictFormatter = dictFormatter;
Vue.prototype.resetForm = resetForm;
Vue.prototype.$doingConfirm = doingConfirm;
Vue.prototype.parseTime = parseTime;
Vue.prototype.$loading = Loading.service;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.getImgSrc = getImgSrc;
Vue.prototype.hasPermission = hasPermission;
Vue.prototype.request = request;
Vue.prototype.requestNoToken = requestNoToken;
Vue.prototype.mockRequest = mockRequest;
Vue.prototype.$request = $request;
Vue.prototype.$mockRequest = $mockRequest;

Vue.prototype.msgSuccess = function(msg) {
  this.$message.closeAll(); // 保证只存在一个message弹框
  this.$message({ showClose: true, message: msg, type: 'success' });
};

Vue.prototype.msgError = function(msg) {
  this.$message.closeAll();
  this.$message({ showClose: true, message: msg, type: 'error' });
};

// 全局组件挂载
// rabbit
Object.keys(RabbitComponents).forEach(key => {
  const component = RabbitComponents[key];
  if (component.name) Vue.component(component.name, component);
});

// monkey
Vue.use(Monkey);

// 指令
Vue.use(directives);

Vue.use(Element, {
  size: getLocalStorage('element-size') || 'small', // set element-ui default size
});

Vue.config.productionTip = false;
