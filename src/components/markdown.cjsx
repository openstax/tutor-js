React = require 'react'
marked = require 'marked'
ArbitraryHtml = require './html'

module.exports = React.createClass
  render: ->
    {text} = @props
    html = marked(text)
    <ArbitraryHtml html={html}/>
