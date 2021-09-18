import PageEditor from "./index";

class DesignCodeCompiler {
  build(componentCodeModel) {
    return PageEditor.write(componentCodeModel, "design");
  }
}
export default new DesignCodeCompiler();
