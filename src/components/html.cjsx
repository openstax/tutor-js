_ = require 'underscore'
React = require 'react'

module.exports = React.createClass
  displayName: 'ArbitraryHtmlAndMath'
  propTypes:
    className: React.PropTypes.string
    html: React.PropTypes.string
    block: React.PropTypes.bool.isRequired
  getDefaultProps: ->
    block: false

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

  # rendering uses dangerouslySetInnerHTML and then runs MathJax,
  # Both of which React can't optimize like it's normal render operations
  # Accordingly, only update if any of our props have actually changed
  shouldComponentUpdate: (nextProps, nextState) ->
    for propName, value of nextProps
      return true if @props[propName] isnt value
    return false

  componentDidMount:  -> @updateDOMNode()
  componentDidUpdate: -> @updateDOMNode()

  # Perform manipulation on HTML contained inside the components node.
  updateDOMNode: ->
    # External links should open in a new window
    root = @getDOMNode()
    links = root.querySelectorAll('a')
    _.each links, (link) ->
      link.setAttribute('target', '_blank') unless link.getAttribute('href')?[0] is '#'

    nodes = root.querySelectorAll('[data-math]:not(.math-rendered)') or []
    hasMath = root.querySelector('math')

    # Return immediatly if no [data-math] or <math> elements are present
    return unless window.MathJax and (_.any(nodes) or hasMath)

    for node in nodes
      formula = node.getAttribute('data-math')
      # divs with data-math should be rendered as a block
      if node.tagName.toLowerCase() is 'div'
        node.textContent = "\u200c\u200c\u200c#{formula}\u200c\u200c\u200c"
      else
        node.textContent = "\u200b\u200b\u200b#{formula}\u200b\u200b\u200b"
      window.MathJax.Hub.Queue(['Typeset', MathJax.Hub, node])
      # mark node as processed
      node.classList.add('math-rendered')

    # render MathML with MathJax
    window.MathJax.Hub.Queue(['Typeset', MathJax.Hub, root]) if hasMath

    # Once MathJax finishes processing, cleanup the MathJax message nodes to prevent
    # React "Invariant Violation" exceptions.
    # MathJax calls queued events in order, so this will be called after processing completes
    window.MathJax.Hub.Queue([ ->
      for nodeId in ['MathJax_Message', 'MathJax_Hidden', 'MathJax_Font_Test']
        el = document.getElementById(nodeId)
        break unless el # the elements won't exist if MathJax didn't do anything
        # Some of the elements are wrapped by divs without selectors under body
        # Select the parentElement unless it's already directly under body.
        el = el.parentElement unless el.parentElement is document.body
        el.parentElement.removeChild(el)
    ])
