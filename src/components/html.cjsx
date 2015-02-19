React = require 'react'
KatexMixin = require './katex-mixin'
$ = require 'jquery'

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

  componentDidMount: ->
    html = $(@getDOMNode())
    links = html.find("a")
    addTarget = (i, link) ->
      $(link).attr("target", "_blank") unless $(link).attr('href')[0] is '#'
    links.each addTarget
