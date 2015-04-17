React = require 'react'
Markdown = require 'markdown-it'
ArbitraryHtml = require './html'

md = new Markdown()

module.exports = React.createClass
  render: ->
    {text} = @props
    html = md.render(text)
    <ArbitraryHtml html={html}/>
