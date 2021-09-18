let events = [];

/**
 * layoutInit 添加执行函数
 * @param fn
 */
const layoutInit = (fn) => {
  if (fn) events.push(fn);
};

/**
 * layoutLoad layout组件 mounted触发
 */
const layoutLoad = () => {
  events.forEach(fn => {
    fn();
  });
};

/**
 * layoutDestroy 清空执行函数
 */
const layoutDestroy = () => {
  events = [];
};

export {
  layoutInit,
  layoutLoad,
  layoutDestroy,
};
