import ItemButton from "./item-button";
import { DictionarySelector, MemberSelector } from "@/components";
import { DropDownTreeSelector, RadioSelector } from "@monkey.do/monkey";

const components = {
  "button": ItemButton,
  "dictionary": DictionarySelector,
  "drop-down-tree": DropDownTreeSelector,
  "member-selector": MemberSelector,
  "radio-selector": RadioSelector,
};

// 验证必填字段
const propRules = {
  "dictionary": ["code"],
  "drop-down-tree": ["data-source-uri", 'source-type'],
};

class FormItemComponent {
  constructor(component) {
    this.component = component;
  }

  getComponent() {
    if (this.valid()) {
      if (this.component.name === "component") {
        if (this.component.component) {
          return this.component.component.name;
        } else {
          console.error("缺少自定义组件");
        }
      } else {
        return components[this.component.name] || this.component.name;
      }
    }
    return null;
  }

  valid() {
    if (!this.component.name) {
      console.error(`缺少必填name属性`);
      return false;
    }

    const rules = propRules[this.component.name] || [];
    const props = this.component.props || {};

    let valid = true;
    for (let i = 0, len = rules.length; i < len; i++) {
      if (!props[rules[i]]) {
        console.error(`组件${this.component.name}缺少必填prop: ${rules[i]}`);
        valid = false;
      }
    }

    return valid;
  }
}

export default FormItemComponent;
