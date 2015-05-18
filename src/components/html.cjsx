_ = require 'underscore'
React = require 'react'
KatexMixin = require './katex-mixin'

module.exports = React.createClass
  displayName: 'ArbitraryHtmlAndMath'
  propTypes:
    className: React.PropTypes.string
    html: React.PropTypes.string
    block: React.PropTypes.bool.isRequired
  getDefaultProps: ->
    block: false

  mixins: [KatexMixin]
  render: ->
    classes = ['has-html']
    classes.push(@props.className) if @props.className
    classes = classes.join(' ')

    if @props.block
      <div className={classes} dangerouslySetInnerHTML={@getHTMLFromProp()} />
    else
      <span className={classes} dangerouslySetInnerHTML={@getHTMLFromProp()} />

  getHTMLFromProp: ->
    {html} = @props
    if html
      __html: html

  componentDidMount:  -> @updateDOMNode()
  componentDidUpdate: -> @updateDOMNode()

  # Perform manipulation on HTML contained inside the components node.
  updateDOMNode: ->
    # External links should open in a new window
    root = @getDOMNode()
    links = root.querySelectorAll('a')
    _.each links, (link) ->
      link.setAttribute('target', '_blank') unless link.getAttribute('href')?[0] is '#'

    # MathML should be rendered by MathJax (if available)
    window.MathJax?.Hub.Queue(['Typeset', MathJax.Hub, root])
    # Once MathML finishes processing, manually cleanup after it to prevent
    # React "Invariant Violation" exceptions.
    # MathJax calls Queued events in order, so this should always execute after typesetting
    window.MathJax?.Hub.Queue([ ->
      for nodeId in ['MathJax_Message', 'MathJax_Hidden', 'MathJax_Font_Test']
        el = document.getElementById(nodeId)
        break unless el # the elements won't exist if MathJax didn't do anything
        # Some of the elements are wrapped by divs without selectors under body
        # Select the parentElement unless it's already directly under body.
        el = el.parentElement unless el.parentElement is document.body
        el.parentElement.removeChild(el)
    ])
