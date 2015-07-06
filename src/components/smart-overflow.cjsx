React = require 'react'
_ = require 'underscore'

ResizeListenerMixin = require './resize-listener-mixin'

SmartOverflow = React.createClass
  propTypes:
    heightBuffer: React.PropTypes.number
    marginBottom: React.PropTypes.number

  getInitialState: ->
    isOverflowing: false
    triggerHeight: null
    style: undefined

  getDefaultProps: ->
    heightBuffer: 20
    marginBottom: 0

  mixins: [ResizeListenerMixin]

  getOffset: ->
    componentNode = @getDOMNode()
    topOffset = componentNode.getBoundingClientRect().top

  getTriggerHeight: ->
    topOffset = @getOffset()
    topOffset + @state.sizesInitial.componentEl.height

  componentDidUpdate: ->
    # on the cycle after sizesInitial initially gets set from ResizeListenerMixin,
    # determine trigger height
    unless _.isEmpty(@state.sizesInitial) or @state.triggerHeight?
      triggerHeight = @getTriggerHeight()
      triggerHeightState = {triggerHeight}
      @setState(triggerHeightState)

      # pass in trigger height as well for initial styles
      sizes = _.defaults({}, @state.sizesInitial, triggerHeightState)
      @_resizeListener(sizes)

  _resizeListener: (sizes) ->
    if sizes.windowEl.height < (sizes.triggerHeight or @state.triggerHeight)
      maxHeight = sizes.windowEl.height - @getOffset() - @props.heightBuffer
      {marginBottom} = @props
      style = {maxHeight, marginBottom}
    else
      style = undefined

    @setState({style})

  render: ->
    {className} = @props

    classes = "#{className} smart-overflow"

    <div className={classes} style={@state.style}>
      {@props.children}
    </div>

module.exports = SmartOverflow
