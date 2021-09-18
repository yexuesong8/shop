export const statusOptions = [
  { key: 1, value: 1, label: "启用" },
  { key: 0, value: 0, label: "停用" },
];

export const defaultPagination = {
  pageNum: 1,
  pageSize: 10,
};

export const listState = {
  ...defaultPagination,
  total: 0,
  list: [],
};

export const DialogFormItemGutter = 48;

/** 工具栏button 间距 */
export const ToolbarGutter = 8;
/** 通用input框最大长度限制 */
export const inputMaxLength = 20;
/** 通用textarea框最大长度限制 */
export const textareaMaxLength = 1000;
/** 价格长度 */
export const priceMaxLength = 15;

export const AMapWebServiceKey = "a6aa7d872280b6d4692bd01b8b5c08f9";
export const TDMapWebServiceKey = "d5b292da467b07f85eae0e869b862984";
export const getRabbitConsolePrefix = (module) => `[rabbit-${module}]:`;
