React = require 'react'
_ = require 'underscore'

componentsToExport = {
  Exercise,
  FreeResponse,

  PinnedHeaderFooterCard,
  PinnedHeader,
  CardBody,
  PinnableFooter,

  Question,
  ArbitraryHtmlAndMath,

  RefreshButton,
  AsyncButton

} = require './index'

mixins = {
  ChapterSectionMixin,
  GetPositionMixin,
  ResizeListenerMixin
} = require './index'

wrapComponent = (component) ->
  (DOMNode, props) ->
    React.render React.createElement(component, props), DOMNode

wrappedExports = _.mapObject componentsToExport, wrapComponent

module.exports = _.extend({}, wrappedExports, mixins)
