React = require 'react'
Markdown = require 'markdown-it'
ArbitraryHtml = require './html'

md = new Markdown()

module.exports = React.createClass
  render: ->
    {text} = @props
    return null unless text
    html = md.render(text)
    <ArbitraryHtml html={html}/>
