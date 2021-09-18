import Vue from "vue";

class PageEditor {
  constructor() {
    this.registerEditors = [];
    this.defaultEditors = [];
  }
  register(editorList, type) {
    if (type === "default") {
      this.defaultEditors = this.defaultEditors.concat(editorList);
    } else {
      this.registerEditors = this.registerEditors.concat(editorList);
    }
    editorList.forEach(item => {
      const { name } = item;
      if (name) {
        Vue.component(name, item);
      }
    });
  }
  getEditors() {
    return this.defaultEditors().concat(this.registerEditors);
  }
  getDefaultEditors() {
    return this.defaultEditors;
  }
  getRegisterEditors() {
    return this.registerEditors;
  }
}

const pageEditor = new PageEditor();
export default pageEditor;
