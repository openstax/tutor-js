module.exports = {
  globals: {
    require: false,
  },
  rules: {
    semi: "off", // it's nice to be able to not have to put semi after long factory def, which is safe because the factories won't be minimized
  }
}
