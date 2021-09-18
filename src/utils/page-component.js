import Vue from "vue";

class PageComponent {
  constructor() {
    this.defaultComponents = [];
    this.registerComponents = [];
  }
  register(componentList, type) {
    if (type === 'default') {
      this.defaultComponents = this.defaultComponents.concat(componentList);
    } else {
      this.registerComponents = this.registerComponents.concat(componentList);
    }

    componentList.forEach(item => {
      const { name } = item;
      if (name) {
        Vue.component(name, item);
      }
    });
  }
  getComponents() {
    return this.getDefaultComponents().concat(this.getSelfComponents());
  }
  getSelfComponents() {
    return this.registerComponents;
  }
  getDefaultComponents() {
    return this.defaultComponents;
  }
}

const pageComponent = new PageComponent();
export default pageComponent;
