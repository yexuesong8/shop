import Vue from "vue";
import { store } from "@/entry/lib";

let instance = null;
let component = null;
let callback = null;

const navBarExtraContentInit = (c, fn = () => {}) => {
  component = c;
  callback = fn;
};

const navBarExtraLoad = () => {
  if (component) {
    const Template = Vue.extend(component);

    const contentEl = document.querySelector("#nav-bar-extra-content");

    if (instance) contentEl.innerHTML = "";

    instance = new Template();

    // 注册store TODO: 其它优化方法
    instance.$store = store;

    instance.destroy = () => {
      contentEl.removeChild(instance.$el);
      instance = null;
    };

    instance.$mount();

    contentEl.appendChild(instance.$el);
  }

  if (callback) callback(instance);
};

export {
  navBarExtraContentInit,
  navBarExtraLoad,
};
