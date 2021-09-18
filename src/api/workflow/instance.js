import { request } from "@/utils";
// 查看抄送
export const getCc = (data) => request({ url: "/rabbit/workflow/type/get/cc/info", data });
// 获取实例
export const getIns = (data) => request({ url: "/rabbit/workflow/instance/get", data });

// 启动
export const start = (data) => request({ url: "/rabbit/workflow/instance/start", data });

// 暂停
export const pause = (data) => request({ url: "/rabbit/workflow/instance/pause", data });

// 继续
export const insContinue = (data) => request({ url: "/rabbit/workflow/instance/continue", data });

// 撤销
export const cancel = (data) => request({ url: "/rabbit/workflow/instance/revocation", data });

// 终止
export const stop = (data) => request({ url: "/rabbit/workflow/instance/stop", data });

// 提交
export const post = (data) => request({ url: "/rabbit/workflow/my/post", data });

// 驳回
export const reject = (data) => request({ url: "/rabbit/workflow/my/reject", data });

// 转办
export const handover = (data) => request({ url: "/rabbit/workflow/my/handover", data });

// 会办
export const together = (data) => request({ url: "/rabbit/workflow/my/together", data });

// 退办
export const retreat = (data) => request({ url: "/rabbit/workflow/instance/retreat", data });

// 跳转
export const jump = (data) => request({ url: "/rabbit/workflow/instance/jump", data });

// 跳转
export const comment = (data) => request({ url: "/rabbit/workflow/my/comment/add", data });

// 实例历史-表格
export const instanceHistoryTable = (data) => request({ url: "/rabbit/workflow/instance/history/table", data });

// 实例历史-时间轴
export const instanceHistoryLine = (data) => request({ url: "/rabbit/workflow/instance/history/timeline", data });

// 实例历史-流程图
export const instanceHistoryMap = (data) => request({ url: "/rabbit/workflow/instance/history/flowchart", data });

// 获取跳转节点
export const getJumpNode = (data) => request({ url: "/rabbit/workflow/instance/node/find/jump", data });

// 获取退办节点
export const getRetreatNode = (data) => request({ url: "/rabbit/workflow/instance/node/find/retreat", data });

// 获取代办按钮
export const getPendingButtons = (data) => request({ url: "/rabbit/workflow/my/pending/button/get", data });
