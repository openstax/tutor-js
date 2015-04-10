React = require 'react'
marked = require 'marked'
ArbitraryHtml = require './html'

module.exports = React.createClass
  render: ->
    <ArbitraryHtml html={marked(@props.children.toString())}/>
