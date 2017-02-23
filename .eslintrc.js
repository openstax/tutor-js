module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "comma-dangle": ["error", "always-multiline"],
    "no-console":  "error",
    "no-debugger": "error",
    "indent": [
      "error",
      2
    ],
    "no-multi-spaces": [2, {
      "exceptions": {
        "Identifier": true,
        "ClassProperty": true,
        "ImportDeclaration": true,
        "VariableDeclarator": true,
        "AssignmentExpression": true
      }
    }],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "react/prefer-stateless-function": [2, {
      "ignorePureComponents": true
    }],
    "react/jsx-uses-vars": [2],
    "react/jsx-indent": [2, 2],
    "react/jsx-indent-props": [2, 2],
    "key-spacing": [2, {
      "singleLine": {
        "beforeColon": false,
        "afterColon":  true
      },
      "multiLine": {
        "beforeColon": false,
        "afterColon":  true,
        "mode": "minimum"
      }
    }],
  }
};
