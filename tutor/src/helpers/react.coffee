getReactBaseName = (context) -> _.kebabCase(context.constructor.displayName)

module.exports = {getReactBaseName}
