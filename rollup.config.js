import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";

export default {
  input:"./tests/index.ts",
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
      "process.env.VUE_ENV": JSON.stringify("browser"),
      "process.env.LANGUAGE": JSON.stringify(process.env.LANGUAGE),
    }),
    typescript(),
  ],
  output: [
    {
      name: "cue",
      format: "es",
      file: "./tests/dist/cue.js",
      sourcemap: true,
    },
  ],
};
