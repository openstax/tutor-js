React = require 'react'
Markdown = require 'markdown-it'
{ArbitraryHtmlAndMath} = require 'shared'
_ = require 'underscore'

md = new Markdown()

module.exports = React.createClass
  render: ->
    {text} = @props
    htmlProps = _.pick(@props, 'block', 'className')

    html = md.render(text)
    htmlProps.html = html

    <ArbitraryHtmlAndMath {...htmlProps}/>
