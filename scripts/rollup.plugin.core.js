import { babel } from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"
import replace from 'rollup-plugin-replace'

function config(input, name) {
  return {
    input: input,
    output: {
      dir: 'dist/core',
      format: 'umd',
      name,
    },
    plugins: [
      babel(),
      terser(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ]
  }
}

module.exports = [
  config("src/plugin/loader.js", "loader"),
  config("src/plugin/inject/plugins.js", "plugins"),
];
