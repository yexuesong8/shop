const components = require("../src/components/component.json");
const fs = require('fs');
const render = require('json-templater/string');
const path = require('path');
const endOfLine = require('os').EOL;
const functions = ["doingConfirm"];

const OUTPUT_PATH = path.join(__dirname, '../src/components/index.js');
const TS_OUTPUT_PATH = path.join(__dirname, '../src/components/index.ts');
const VUE_IMPORT_TEMPLATE = 'import {{name}} from \'{{src}}.vue\';';
const TS_IMPORT_TEMPLATE = 'import \{ {{name}} \} from \'{{src}}\';';
const FUNCTION_TEMPLATE = 'import \{ {{name}} \} from \'{{src}}\';';
const MAIN_TEMPLATE = `/* Automatically generated by './scripts/generate-component-entry.js' */

{{include}}

export {
{{list}},
};
`;

const includeComponentTemplate = [];
const tsIncludeComponentTemplate = [];
const listTemplate = [];

Object.keys(components).forEach(name => {
  if (functions.includes(name)) {
    listTemplate.push(`  ${name}`);
    includeComponentTemplate.push(render(FUNCTION_TEMPLATE, {
      name: name,
      src: components[name],
    }));
    tsIncludeComponentTemplate.push(render(FUNCTION_TEMPLATE, {
      name: name,
      src: components[name],
    }));
  } else {
    includeComponentTemplate.push(render(VUE_IMPORT_TEMPLATE, {
      name: name,
      src: components[name],
    }));
    tsIncludeComponentTemplate.push(render(TS_IMPORT_TEMPLATE, {
      name: name,
      src: components[name],
    }));
    listTemplate.push(`  ${name}`);
  }

});

const template = render(MAIN_TEMPLATE, {
  include: includeComponentTemplate.join(endOfLine),
  list: listTemplate.join(',' + endOfLine),
});

const tsTemplate = render(MAIN_TEMPLATE, {
  include: tsIncludeComponentTemplate.join(endOfLine),
  list: listTemplate.join(',' + endOfLine),
});

fs.writeFileSync(OUTPUT_PATH, template);
fs.writeFileSync(TS_OUTPUT_PATH, tsTemplate);

console.log('[build components-entry] DONE');
