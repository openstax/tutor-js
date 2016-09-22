React = require 'react'
_ = require 'underscore'
Markdown = require 'markdown-it'

ArbitraryHtmlAndMath = require './html'

md = new Markdown()

module.exports = React.createClass
  displayName: 'Markdown'
  render: ->
    {text} = @props
    htmlProps = _.pick(@props, 'block', 'className')

    html = md.render(text)
    htmlProps.html = html

    <ArbitraryHtmlAndMath {...htmlProps}/>
