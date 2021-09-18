<template>
  <div style="height: 100%;">
    <textarea ref="mycode" v-model="code" class="codesql" />
  </div>
</template>
<script>
import { randomCoding } from "@/views/page/design/utils";
import * as CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/theme/ambiance.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/theme/rubyblue.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/vue/vue';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/xml-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import "codemirror/addon/fold/brace-fold.js";
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/theme/monokai.css';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/html-hint';
import 'codemirror/addon/hint/css-hint';

require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/selection/active-line');
require('codemirror/mode/vue/vue');
require('codemirror/addon/hint/show-hint');
require('codemirror/lib/codemirror.css');
require('codemirror/lib/codemirror.js');
export default {
  name: 'CodeMirror',
  inject: {
    componentPropertyData: {
      default: () => {},
    },
  },
  props: {
    code: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "text/x-vue",
    },
    disabled: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      // code: '//按Ctrl键进行代码提示',
      editor: undefined,
      theme: {
        monokai: "monokai",
        ambiance: "ambiance",
      },
    };
  },
  computed: {
    componentsObj() {
      return this.componentPropertyData();
    },
  },
  watch: {
    mode: {
      handler(value) {
        console.log(value, "mode");
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const that = this;
      const editor = CodeMirror.fromTextArea(this.$refs.mycode, {
        mode: this.mode, // 选择对应代码编辑器的语言
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        theme: that.theme.ambiance, // 设置主题
        autofocus: true,
        autoRefresh: true, // 自动触发刷新
        // extraKeys: { Ctrl: 'autocomplete' }, // 自定义快捷键
        foldGutter: true,
        lineWrapping: true,
        indentUnit: 4,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
        hintOptions: {
        // 自定义提示选项
          completeSingle: false,
          tables: {
            users: ['name', 'score', 'birthDate'],
            countries: ['name', 'population', 'size'],
          },
        },
        readOnly: this.disabled, // 只读  nocursor 只读且不能复制
      });
      // 设置编辑器宽高
      editor.setSize('auto', '90%');
      // setTimeout(() => {
      //   this.editor.refresh();
      // }, 1);// 让编辑器每次在调用的时候进行自动刷新
      // 代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
      // editor.on('cursorActivity', function() {
      //   editor.showHint();
      // });
      editor.on('change', function(event, data) {
        const value = editor.getValue();
        that.$emit("change", value);
      });
      editor.on('beforeChange', function(event, data) {
        if (data.origin === "+input" && data.text[0] === ">") {
          const currentLineContent = editor.getLine(data.from.line);
          if (currentLineContent.indexOf("<") === -1) return;
          const tagName = currentLineContent.substring(currentLineContent.indexOf("<") + 1);
          const endIndex = currentLineContent.split("").reverse().join("").indexOf("/<");
          if (currentLineContent.indexOf("did") === -1 && !(endIndex !== -1 || (endIndex > -1 && endIndex < 20))) { // 不存在did 添加did
            const random = randomCoding();
            let component = {};
            // 获取组件id
            that.componentsObj.componentGroups.forEach(item => {
              item.components.forEach(itemChild => {
                if (tagName === itemChild.code || (tagName === "el-row" && itemChild.code === "pg-row") || (tagName === "el-form" && itemChild.code === "pg-form")) {
                  component = JSON.parse(JSON.stringify(itemChild));
                }
              });
            });
            // 获取组件属性
            const props = [];
            const property = component.id ? that.componentsObj.propertyGroups[component.id] || [] : [];
            property.forEach(pyItem => {
              pyItem.properties.forEach(pycItem => {
                props.push(` ${pycItem.code}='${JSON.parse(JSON.stringify(pycItem.defaultValue))}'`);
              });
            });
            props.push(` did="${random}"`);
            if (component.id) props.push(` cid="${component.id}"`);
            data.text = ["", ...props, ...data.text];
            // 结尾标签
            data.text.push(`</${tagName}>`);
          }
        }
        if (data.origin === "paste") { // 复制
          if (data.text.length) {
            data.text.forEach((item, index) => {
              const didIndex = item.indexOf("did");
              if (didIndex !== -1) {
                const startStr = item.substring(didIndex + 5); // 5代表 did=" 截取到did开始位置
                const endIndex = startStr.indexOf(`"`) === -1 ? startStr.indexOf(`'`) : startStr.indexOf(`"`);
                const did = item.substr(didIndex + 5, endIndex);
                const random = randomCoding();
                const newStr = item.replace(did, random);
                data.text.splice(index, 1, newStr);
              }
            });
          }
        }
      });
      this.editor = editor;
    },
    getValue() {
      return this.editor.getValue();
    },
  },
};
</script>

