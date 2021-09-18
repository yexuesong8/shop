class DataSourceCodeCompiler {
  white(pageCodeModel) {
    return this.makeUpDataSource(pageCodeModel);
  }
  makeUpDataSource(pageCodeModel) {
    const dataList = [];
    pageCodeModel.hide.forEach(item => {
      const { code, props: { id, dataSourceType, source, dataSourceMethod }} = item;
      const idStr = id ? `id="${id}"` : "";
      const dataSourceTypeStr = dataSourceType ? `type="${dataSourceType}"` : "";
      const dataSourceMethodStr = dataSourceMethod ? `method="${dataSourceMethod}"` : "";
      const str = `<${code} ${idStr} ${dataSourceTypeStr} ${dataSourceMethodStr} >${source}</${code}>`;
      dataList.push(str);
    });
    return `<data-sources>\n  ${dataList.join("\n")}\n</data-sources>`;
  }
}
export default new DataSourceCodeCompiler();
