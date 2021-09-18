import {
  comment, stop, insContinue,
  together, handover, reject, jump,
  post, pause, cancel, retreat,
  getPendingButtons,
} from "@/api/workflow/instance";

export const buttons = {
  "processed": [],
  "pending": [
    { name: "提交", type: "post", params: "post" },
    { name: "转办", type: "handover", params: "handover" },
    { name: "会办", type: "together", params: "together" },
    { name: "驳回", type: "reject", params: "reject" },
    { name: "跳转", type: "jump", params: "jump" },
    { name: "退办", type: "retreat", params: "retreat" },
    { name: "批注", type: "comment", params: "comment" },
  ],
  "initiate": [
    { name: "暂停", condition: { status: 1 }, type: "pause", params: "pause", buttonType: "danger" },
    { name: "撤销", condition: { status: 1 }, type: "cancel", params: "cancel", buttonType: "danger" },
    { name: "继续", condition: { status: 5 }, type: "continue", params: "continue" },
  ],
  "monitor": [
    // { name: "跳转", params: "jump", type: "jump", condition: { status: 1 }},
    // { name: "退办", params: "retreat", type: "retreat", condition: { status: 1 }},
    { name: "暂停", params: "pause", type: "pause", condition: { status: 1 }, buttonType: "danger" },
    { name: "终止", params: "stop", type: "stop", condition: { status: 1 }, buttonType: "danger" },
    { name: "继续", params: "continue", type: "continue", condition: { status: 5 }},
  ],
};

const dangersButtons = ["stop", "retreat", "reject"];
const replaceName = {
  "goOn": "continue",
};

export const getButtons = (data) => {
  const buttons = [];
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    if (!keys[i].includes("Name")) {
      if (data[keys[i]]) { // 为 true
        buttons.push({
          name: replaceName[keys[i]] || data[`${keys[i]}Name`],
          type: replaceName[keys[i]] || keys[i],
          params: replaceName[keys[i]] || keys[i],
          buttonType: dangersButtons.includes(keys[i]) ? "danger" : "primary",
        });
      }
    }
  }
  return buttons;
};

const functions = {
  "comment": comment, // 批注
  "pause": pause, // 暂停,
  "continue": insContinue, // 继续
  "post": post,
  "stop": stop,
  "handover": handover,
  "reject": reject,
  "jump": jump,
  "cancel": cancel,
  "retreat": retreat,
  "together": together,
  "getPendingButtons": getPendingButtons,
};

export const handleFunction = (type, params) => new Promise((resolve, reject) => {
  try {
    functions[type](params).then((res) => {
      resolve(res);
    });
  } catch (e) {
    console.error(e);
    reject(e);
  }
});

const tipMessage = {
  "continue": {
    title: "继续",
    message: "确定继续流程?",
  },
  "cancel": {
    title: "继续",
    message: "确定继续流程?",
  },
  "stop": {
    title: "终止",
    message: "确定终止流程?",
  },
  "pause": {
    title: "暂停",
    message: "确定暂停流程?",
  },
  "jump": {
    title: "跳转",
    message: "确定跳转流程?",
  },
  "retreat": {
    title: "退办",
    message: "确定退办流程?",
  },
};
export const getTipMessage = (type) => !type ? { title: "", message: "" } : tipMessage[type];

export const getTotalTime = (row) => {
  if (row.endTime && row.beginTime) {
    return Math.ceil((row.endTime - row.beginTime) / 1000 / 60);
  }
  if (row.beginTime) {
    return Math.ceil((new Date().getTime() - row.beginTime) / 1000 / 60);
  }
  return 0;
};
