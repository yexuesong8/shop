import { isArray } from "@monkey.do/monkey";
import { getElementType } from "./index";

const validateAutoNodesType = ["start", "end", "auto"];

export const rules = {
  "node": {
    groups: [
      {
        when: [
          { field: ["handler", "roleList"], type: "array", comparator: "!!", isOr: true },
          { field: ["handler", "deptList"], type: "array", comparator: "!!", isOr: true },
          { field: ["handler", "jobList"], type: "array", comparator: "!!", isOr: true },
          { field: ["handler", "memberList"], type: "array", comparator: "!!", isOr: true },
          { field: "handlerContent", type: "string", comparator: "!!", isOr: true },
        ],
        message: "办理人不能为空",
      },
    ],
    fields: [
      { field: "name", comparator: "!!", message: "请填写名称" },
      { field: "timeoutType", comparator: "!!", message: "请选择超时类型",
        when: [
          { field: "enabledTimeout", comparator: "===", value: 1 },
        ],
      },
      { field: "timeoutLength", comparator: "!!", message: "请填写超时时长",
        when: [
          { field: "enabledTimeout", comparator: "===", value: 1 },
        ],
      },
      { field: "timeoutOperation", comparator: "!!", message: "请选择超时操作",
        when: [
          { field: "enabledTimeout", comparator: "===", value: 1 },
        ],
      },
      { field: "postProportion", comparator: "!!", message: "请填写提交率",
        when: [
          { field: "passType", comparator: "===", value: "3" },
        ],
      },
      { field: "handlerContent", comparator: "!!",
        when: [
          { field: "handlerType", comparator: ">", value: 0 },
        ],
        message: "请填写自定义办理人执行内容",
      },
    ],
  },
  "process": {
    fields: [
      { field: "formId", comparator: "!!", message: "请填写表单" },
    ],
  },
  "line": {
    fields: [
      { field: "conditionContent", comparator: "!!", message: "请填写条件执行内容",
        when: [
          { field: "conditionType", comparator: ">", value: 0 },
        ],
      },
      { field: "dataConvertContent", comparator: "!!", message: "请填写自定义办理人执行内容",
        when: [
          { field: "dataConvertType", comparator: ">", value: 0 },
        ],
      },
    ],
  },
};

/**
 * 所有elements验证
 * @param elements 需要验证的elements 节点
 * @param data 所有数据
 * @returns {{valid: *, message: *}|{valid: boolean, message: string}}
 */
export function elementsValidate(elements = [], data) {
  for (let i = 0; i < elements.length; i++) {
    const { valid, message } = elementValidate(elements[i], data);
    if (!valid) return { valid, message, element: elements[i] };
  }
  return { valid: true, message: "" };
}

/**
 * 单个element验证
 * @param element
 * @param data
 * @returns {{valid: *, message: *}|{valid: boolean, message: string}}
 */
export function elementValidate(element, data) {
  const elementId = element.id;
  const elementType = getElementType(element);
  if (validateAutoNodesType.includes(elementType)) return validateFields(rules["auto"], data[elementId]);
  if (elementType) {
    if (elementType === 'process') {
      return validateFields(rules[elementType], data.process);
    }
    return validateFields(rules[elementType], data[elementId]);
  }
  return { valid: true, message: "" };
}

/**
 * 验证所有fields
 * @param rules 判断规则
 * @param data 源数据
 * @returns {{valid: *, message: *}} 返回true时表示验证通过 false验证不通过
 */
export function validateFields(rules = { fields: [], groups: [] }, data = {}) {
  const { fields = [], groups = [] } = rules;

  let fieldValidate = true;
  let message = "";

  // 验证fields
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (field.when) {
      const whenValid = validateFieldWhen(field, data);
      if (whenValid) { // 满足判断条件 进行判断fields
        const result = validateField(field, data);
        fieldValidate = result.valid;
        message = result.message;
      }
    } else {
      const result = validateField(field, data);
      fieldValidate = result.valid;
      message = result.message;
    }
  }

  // field验证不通过
  if (!fieldValidate) return { valid: false, message };

  // 验证groups
  for (let i = 0; i < groups.length; i++) {
    const { valid: groupValid, message } = validateGroup(groups[i], data);
    if (!groupValid) return { valid: false, message: message || "group验证没通过" };
  }

  return { valid: true, message: "" };
}

export function validateField(field, data) {
  const fieldValid = validateFieldComparator(field, data, "field");
  if (!fieldValid) return { valid: false, message: field.message || "" };
  return { valid: true, message: "" };
}

export function validateGroup(group = { when: [], message: "" }, data) {
  const valid = validateFieldGroup(group, data);
  if (!valid) return { valid: false, message: group.message };
  return { valid: true, message: "" };
}

export function validateFieldGroup(group, data, type) {
  let valid = true;

  const { when: groupWhen = [] } = group;

  for (let i = 0; i < groupWhen.length; i++) {
    if (groupWhen[i].isOr) {
      const curValid = validateFieldComparator(groupWhen[i], data, type);
      if (curValid) {
        valid = true;
        break;
      }
      valid = false;
    } else {
      valid = valid && validateFieldComparator(groupWhen[i], data, type);
    }
  }

  return valid;
}

/**
 * 判断是否满足判断条件
 * @param field 判断条件
 * @param data 源数据
 * @returns {boolean} 返回true时表示验证通过 false验证不通过
 */
export function validateFieldWhen(field, data) {
  return validateFieldGroup(field, data, "when");
}

/**
 * 判断条件 true || false
 * @param condition
 * @param data
 * @param type 判断类型 when:条件 field: 字段
 * @returns {boolean} 返回true时表示验证通过 false验证不通过
 */
export function validateFieldComparator(condition, data, type) {
  let valid = true;

  const value = isArray(condition.field) ? getArrayConditionValue(data, condition.field) : data[condition.field];

  // 当判断是否满足条件时， 不存在则满足。判断field时，不存在则不满足 返回
  const validateIsExist = type === "when" ? !value : !!value;

  switch (condition.comparator) {
    case "!!": // 必填
      if (condition.type === "array") {
        valid = validateIsExist && value && value.length;
      } else {
        valid = validateIsExist && !!value;
      }
      break;
    case "!==":
      valid = validateIsExist && value !== condition.value;
      break;
    case "===":
      valid = validateIsExist && value === condition.value;
      break;
    case ">=":
      valid = validateIsExist && value >= condition.value;
      break;
    case ">":
      valid = validateIsExist && value > condition.value;
      break;
    case "<":
      valid = validateIsExist && value < condition.value;
      break;
    case "<= ":
      valid = validateIsExist && value <= condition.value;
      break;
  }

  // 当判断是否满足条件时 默认true， 判断fields时默认false
  return valid;
}

function getArrayConditionValue(data, fields) {
  let value = null;
  fields.forEach(field => {
    if (value) {
      value = value[field];
    } else {
      value = data[field];
    }
  });
  return value;
}
