export const formConfig = {
  formRef: 'elForm',
  formModel: 'form',
  formSize: 'medium',
  code: "pg-form",
  jsonData: "jsonData",
  labelPosition: 'right',
  labelWidth: "100px",
  formRules: 'rules',
  gutter: 15,
  disabled: false,
  span: 24,
  formBtns: true,
};

export const templateStart = '<template>';
export const templateEnd = '</template>';
export const styleStart = '/*STYLE_START*/';
export const styleEnd = '/*STYLE_END*/';
export const exportStart = '// EXPORT_START';
export const exportEnd = '// EXPORT_END';
export const codeType = { execute: "execute", design: "design" };
export const formList = ["pg-input", "pg-select"];

// 代码格式化配置
export const beautifierConf = {
  html: {
    "indent_size": 2,
    "indent_char": " ",
    "indent_with_tabs": false,
    "editorconfig": false,
    "eol": "\n",
    "end_with_newline": false,
    "indent_level": 0,
    "preserve_newlines": false,
    "max_preserve_newlines": 4,
    "space_in_paren": false,
    "space_in_empty_paren": false,
    "jslint_happy": false,
    "space_after_anon_function": false,
    "space_after_named_function": false,
    "brace_style": "collapse",
    "unindent_chained_methods": false,
    "break_chained_methods": false,
    "keep_array_indentation": false,
    "unescape_strings": false,
    "wrap_line_length": 0,
    "e4x": true,
    "comma_first": false,
    "operator_position": "before-newline",
    "indent_empty_lines": false,
    "templating": ["auto"],
  },
};

