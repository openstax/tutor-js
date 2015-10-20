exportsToPassOn = require './index'
mixinsNames = ['ChapterSectionMixin', 'GetPositionMixin', 'ResizeListenerMixin']

componentsToExport = _.omit(exportsToPassOn, mixinsNames)
mixins = _.pick(exportsToPassOn, mixinsNames)

wrapComponent = (component) ->
  (DOMNode, props) ->
    React.render React.createElement(component, props), DOMNode

wrappedExports = _.mapObject componentsToExport, wrapComponent

module.exports = _.extend({}, wrappedExports, mixins)
