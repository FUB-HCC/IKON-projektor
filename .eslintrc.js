module.exports = {
    extends: ["standard", "plugin:react/recommended"],
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    },
    env: {
      browser: 1,
      jasmine: true
    },
    plugins: ["react"],
    rules:{
      "react/display-name": "off",
      "react/prop-types": "off",
      "no-new-wrappers": "off",
      "no-var": 2,
        "indent": 2,
        "no-trailing-spaces": "off"
    },
    globals: {
      "_": false // Exclude warnings when using underscore.js
    }
  }
