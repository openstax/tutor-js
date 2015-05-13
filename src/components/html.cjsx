_ = require 'underscore'
React = require 'react'

module.exports = React.createClass
  displayName: 'ArbitraryHtmlAndMath'
  propTypes:
    className: React.PropTypes.string
    html: React.PropTypes.string
    block: React.PropTypes.bool

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

    # Clone the array because the browser will mutable it
    nodes = root.querySelectorAll('[data-math]:not(.math-rendered)') or []
    nodes = _.toArray(nodes)

    _.each nodes, (node) ->
      formula = node.getAttribute('data-math')

      # Divs with data-math should be rendered as a block
      isBlock = node.tagName.toLowerCase() in ['div']
      if isBlock
        node.textContent = "{{MATH_BLOCK}}#{formula}{{MATH_BLOCK}}"
      else
        node.textContent = "{{MATH}}#{formula}{{MATH}}"

    cb = ->
      _.each nodes, (node) ->
        node.classList.add('math-rendered')

    # MathML should be rendered by MathJax (if available)
    window.MathJax?.Hub.Queue(['Typeset', MathJax.Hub, root], cb)
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
