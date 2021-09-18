import { _typeof } from "@monkey.do/monkey";

function isRepeatDot(string) {
  const arr = [];
  for (let i = 0, len = string.length; i < len; i++) {
    if (string[i] === '.') {
      arr.push(i);
    }
  }
  return arr;
}

function replaceFirstChar(string, char) {
  let newString = string;
  if (string[0] === char) newString = newString.substring(1, newString.length);
  return newString;
}

export default {
  bind(el, binding, vnode) {
    const input = el.children[0];
    const valueType = _typeof(binding.value);

    input.oninput = function() {
      if (!binding.value) {
        this.value = replaceFirstChar(this.value, "0").replace(/[^\d]/g, '');
      } else {
        // 整数
        if (valueType === 'number') {
          this.value = replaceFirstChar(this.value, "0").replace(/[^\d]/g, '').substring(0, binding.value);
        } else if (valueType === 'object') {
          const { type, precision, maxLength } = binding.value;
          if (type === 'float') {
            this.value = replaceFirstChar(replaceFirstChar(this.value, "0"), ".").replace(/[^\d.]/g, '');

            const dotIndexArr = isRepeatDot(this.value);
            if (dotIndexArr.length > 1) {
              this.value = `${this.value.substring(0, dotIndexArr[1])}${this.value.substring(dotIndexArr[1] + 1, this.value.length + 1)}`;
            }

            if (precision) {
              const stringArr = this.value.split(".");
              const precisionString = stringArr[1];
              if (precisionString && precisionString.length > precision) {
                const newPrecisionString = precisionString.substring(0, precision);
                this.value = `${stringArr[0]}.${newPrecisionString}`;
              }
            }

            if (maxLength) {
              this.value = this.value.substring(0, maxLength);
            }
          }
        }
      }

      if (vnode.componentInstance) { // 手动触发双向绑定
        vnode.componentInstance.$emit('input', this.value);
      } else {
        vnode.elm.dispatchEvent(new CustomEvent('input', this.value));
      }
    };

    input.onblur = function() {
      // 以.结尾
      if (this.value.indexOf(".") === this.value.length - 1) {
        this.value = this.value.replace(/.$/g, "");
        if (vnode.componentInstance) { // 手动触发双向绑定
          vnode.componentInstance.$emit('input', this.value);
        } else {
          vnode.elm.dispatchEvent(new CustomEvent('input', this.value));
        }
      }
    };
  },
};
