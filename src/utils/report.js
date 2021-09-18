import Vue from "vue";
import PreviewTemplate from "@/views/system/report/preview/detail.vue";

const Template = Vue.extend(PreviewTemplate);

let instance = null;

export function openBill(opts) {
  const {
    id,
    code,
  } = opts;

  // 存在实例则销毁之前的实例
  if (instance) instance.cancel();
  instance = new Template({
    data: {
      id,
      code,
    },
  });
  instance.visible = true;

  instance.cancel = () => {
    instance.visible = false;
  };

  instance.instance = instance;

  instance.$mount();
  document.body.appendChild(instance.$el);

  return instance;
}

export function openReport(opts) {
  const {
    code,
  } = opts;

  // 存在实例则销毁之前的实例
  if (instance) instance.cancel();
  instance = new Template({
    data: {
      code,
    },
  });
  instance.visible = true;

  instance.cancel = () => {
    instance.visible = false;
  };

  instance.instance = instance;

  instance.$mount();
  document.body.appendChild(instance.$el);

  return instance;
}
