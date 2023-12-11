module.exports = {
  "env": {
    browser: true,
    es6: true,
    node: true,
  },
  "extends": [
    "airbnb",
    "prettier",
    "plugin:node/recommended"
  ],
  "settings": {
    "import/resolver": "node"
  },
  "plugins": [
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
    "no-unused-vars": "warn",
    "no-console": "off",
    "func-names": "off",
    "no-process-exit": "off",
    "object-shorthand": "off",
    "class-methods-use-this": "off"
  }
};
