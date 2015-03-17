_ = require 'underscore'
React = require 'react'
KatexMixin = require './katex-mixin'

module.exports = React.createClass
  displayName: 'ArbitraryHtmlAndMath'
  mixins: [KatexMixin]
  render: ->
    classes = ['has-html']
    classes.push(@props.className) if @props.className
    classes = classes.join(' ')

    if @props.block
      <div className={classes} dangerouslySetInnerHTML={__html:@props.html} />
    else
      <span className={classes} dangerouslySetInnerHTML={__html:@props.html} />

  componentDidMount: ->
    # External links should open in a new window
    root = @getDOMNode()
    links = root.querySelectorAll('a')
    _.each links, (link) ->
      link.setAttribute('target', '_blank') unless link.getAttribute('href')?[0] is '#'

    # MathML should be rendered by MathJax (if available)
    window.MathJax?.Hub.Queue(['Typeset', MathJax.Hub], @getDOMNode())
