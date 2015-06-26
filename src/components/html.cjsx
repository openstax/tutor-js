_ = require 'underscore'
React = require 'react'

{typesetMath} = require '../helpers/mathjax'

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
    typesetMath(root)
