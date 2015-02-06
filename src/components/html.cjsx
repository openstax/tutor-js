React = require 'react'
katex = require 'katex'

module.exports = React.createClass
  displayName: 'ArbitraryHtmlAndMath'
  render: ->
    classes = ['arbitrary-html-and-math']
    classes.push(@props.className) if @props.className

    if @props.block
      <div className={classes.join(' ')} dangerouslySetInnerHTML={__html:@props.html} />
    else
      <span className={classes.join(' ')} dangerouslySetInnerHTML={__html:@props.html} />

  renderMath: ->
    for node in @getDOMNode().querySelectorAll('[data-math]:not(.loaded)')
      formula = node.getAttribute('data-math')

      # Divs with data-math should be rendered as a block
      isBlock = node.tagName.toLowerCase() in ['div']

      if isBlock
        formula = "\\displaystyle {#{formula}}"

      katex.render(formula, node)
      node.classList.add('loaded')

  componentDidMount:  -> @renderMath()
  componentDidUpdate: -> @renderMath()
