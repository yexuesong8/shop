
// 生成随机字母+数字
export const randomCoding = () => {
  // 创建26个字母数组
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let idValue = '';
  const n = 4;// 这个值可以改变的，对应的生成多少个，根据自己需求所改
  for (let i = 0; i < n; i++) {
    idValue += arr[Math.floor(Math.random() * 9)];
  }
  return idValue + Date.parse(new Date());
};
// 处理字符串转对象
export const handleStringFunction = (str) => {
  let strings = str || "";
  const flag = (str.indexOf("[") !== -1 && str.indexOf("]") !== -1) || (str.indexOf("{") !== -1 || str.indexOf("}") !== -1);
  if (flag) {
    const fnStr = `return ${str}`;
    strings = new Function(fnStr)();
  }
  return strings;
};

export const isNumber = (val) => {
  const regPos = /^\d+(\.\d+)?$/; // 非负浮点数
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
  return regPos.test(val) || regNeg.test(val);
};

export const parseDom = (str) => {
  const objE = document.createElement("div");
  objE.innerHTML = str;
  return objE.children;
};
// 首字母大小
export const titleCase = (str) => {
  return str.replace(/( |^)[a-z]/g, L => L.toUpperCase());
};
// 数组对象去重 data key 去重标识
export const handleArrayRepeat = (data, key) => {
  return Array.from(data.reduce((result, item) => result.set(key ? item[key] : item.id, item), new Map()).values());
};

