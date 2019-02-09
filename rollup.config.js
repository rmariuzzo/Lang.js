import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import nodeResolve from "rollup-plugin-node-resolve";
import { uglify } from "rollup-plugin-uglify";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";

const name = "lang";
const input = "src/index.ts";
const globalName = "Lang";

function external(id) {
  return !id.startsWith(".") && !id.startsWith("/");
}

const cjs = [
  {
    input,
    output: { file: `cjs/${name}.js`, format: "cjs" },
    external,
    plugins: [
      typescript(),
      babel({ exclude: /node_modules/ }),
      replace({ "process.env.NODE_ENV": JSON.stringify("development") })
    ]
  },
  {
    input,
    output: { file: `cjs/${name}.min.js`, format: "cjs" },
    external,
    plugins: [
      typescript(),
      babel({ exclude: /node_modules/ }),
      replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
      uglify()
    ]
  }
];

const esm = [
  {
    input,
    output: { file: `esm/${name}.js`, format: "esm" },
    external,
    plugins: [
      typescript(),
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]]
      }),
      sizeSnapshot()
    ]
  }
];

const globals = {};

const umd = [
  {
    input,
    output: {
      file: `umd/${name}.js`,
      format: "umd",
      name: globalName,
      globals
    },
    external: Object.keys(globals),
    plugins: [
      typescript(),
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]]
      }),
      nodeResolve(),
      commonjs({
        include: /node_modules/,
        namedExports: {
          "node_modules/lodash/index.js": ["get"]
        }
      }),
      replace({ "process.env.NODE_ENV": JSON.stringify("development") }),
      sizeSnapshot()
    ]
  },
  {
    input,
    output: {
      file: `umd/${name}.min.js`,
      format: "umd",
      name: globalName,
      globals
    },
    external: Object.keys(globals),
    plugins: [
      typescript(),
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]]
      }),
      nodeResolve(),
      commonjs({
        include: /node_modules/,
        namedExports: {
          "node_modules/lodash/index.js": ["get"]
        }
      }),
      replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
      sizeSnapshot(),
      uglify()
    ]
  }
];

let config;
switch (process.env.BUILD_ENV) {
  case "cjs":
    config = cjs;
    break;
  case "esm":
    config = esm;
    break;
  case "umd":
    config = umd;
    break;
  default:
    config = cjs.concat(esm).concat(umd);
}

export default config;
