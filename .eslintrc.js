module.exports = {
  extends: "airbnb-base",
  rules: {
    "no-bitwise": "off",
    "no-mixed-operators": 0,
    "linebreak-style": [0, "error", "windows"],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
  },
  env: {
    es6: true,
    mocha: true,
    node: true,
    browser: true,
  },
  globals: {
    moment: true,
  },
};
