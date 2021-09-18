import PageEditor from "./index";

class ExecuteCodeCompiler {
  build(componentCodeModel) {
    return PageEditor.write(componentCodeModel, "execute");
  }
}
export default new ExecuteCodeCompiler();
