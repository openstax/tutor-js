React = require 'react'
_ = require 'underscore'

ResizeListenerMixin = require './resize-listener-mixin'

SmartOverflow = React.createClass
  propTypes:
    heightBuffer: React.PropTypes.number
    marginBottom: React.PropTypes.number

  getInitialState: ->
    isOverflowing: false
    triggerHeight: 0
    style: undefined

  getDefaultProps: ->
    heightBuffer: 20
    marginBottom: 0

  mixins: [ResizeListenerMixin]

  getOffset: ->
    componentNode = @getDOMNode()
    topOffset = componentNode.getBoundingClientRect().top

  setTriggerHeight: ->
    # set this on the event queue after ResizeListenerMixin's componentDidMount
    # so that we can use the initial component height as reference
    _.delay =>
      topOffset = @getOffset()
      triggerHeight = topOffset + @state.sizesInitial.componentEl.height

      @setState({triggerHeight})
    , 0

  componentDidMount: ->
    @setTriggerHeight()

  componentWillUpdate: (nextProps, nextState) ->
    if nextState.windowEl.height < nextState.triggerHeight
      maxHeight = nextState.windowEl.height - @getOffset() - nextProps.heightBuffer
      {marginBottom} = @props
      nextState.style = {maxHeight, marginBottom}
    else
      nextState.style = undefined

  render: ->
    {className} = @props

    classes = "#{className} smart-overflow"

    <div className={classes} style={@state.style}>
      {@props.children}
    </div>

module.exports = SmartOverflow
