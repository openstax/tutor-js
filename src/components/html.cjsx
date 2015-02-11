React = require 'react'
KatexMixin = require './katex-mixin'

module.exports = React.createClass
  displayName: 'ArbitraryHtmlAndMath'
  mixins: [KatexMixin]
  render: ->
    classes = ['has-html']
    classes.push(@props.className) if @props.className

    if @props.block
      <div className={classes.join(' ')} dangerouslySetInnerHTML={__html:@props.html} />
    else
      <span className={classes.join(' ')} dangerouslySetInnerHTML={__html:@props.html} />
