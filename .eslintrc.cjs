/**
 * This is intended to be a basic starting point for linting in your app.
 * It relies on recommended configs out of the box for simplicity, but you can
 * and should modify this configuration to best suit your team's needs.
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  // .eslintignore 相当。すでに設定済みならそのままでOK
  ignorePatterns: ["!**/.server", "!**/.client"],

  // Base config
  extends: ["eslint:recommended"],

  overrides: [
    // --------------------------
    // React 用設定
    // --------------------------
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      plugins: ["react", "jsx-a11y"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
      ],
      settings: {
        react: {
          version: "detect",
        },
        formComponents: ["Form"],
        linkComponents: [
          { name: "Link", linkAttribute: "to" },
          { name: "NavLink", linkAttribute: "to" },
        ],
        // import/resolver は下のTSオーバーライドにも設定しますが、
        // ここに置いても問題ありません。TSオーバーライドで上書きされます。
        "import/resolver": {
          typescript: {},
        },
      },
    },

    // --------------------------
    // TypeScript 用設定
    // --------------------------
    {
      files: ["**/*.{ts,tsx}"],
      plugins: ["@typescript-eslint", "import"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        // ここでtsconfig.jsonへのパスを明示
        project: ["./tsconfig.json"],
        // tsconfig.json が存在するルートディレクトリを指定
        tsconfigRootDir: __dirname,
      },
      settings: {
        "import/internal-regex": "^~/",
        "import/resolver": {
          node: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
          },
          typescript: {
            alwaysTryTypes: true,
            // こちらでも念のためプロジェクトパスを指定
            project: "./tsconfig.json",
          },
        },
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
      ],
    },

    // --------------------------
    // Node 用設定
    // --------------------------
    {
      files: [".eslintrc.cjs"],
      env: {
        node: true,
      },
    },
  ],
};