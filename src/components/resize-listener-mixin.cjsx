React = require 'react'
_ = require 'underscore'

module.exports =
  propTypes:
    resizeThrottle: React.PropTypes.number

  getDefaultProps: ->
    resizeThrottle: 200

  getInitialState: ->
    windowEl: {}
    componentEl: {}
    sizesInitial: {}
    resizing:
      height: false
      width: false

  componentWillMount: ->
    # need to define @resizeListener so that we can throttle resize effect
    # and have access to @state.resizeThrottle or @props.resizeThrottle
    @resizeListener = _.throttle(@resizeEffect, @state.resizeThrottle or @props.resizeThrottle)

  componentDidMount: ->
    @setInitialSize()
    window.addEventListener('resize', @resizeListener)

  componentWillUnmount: ->
    window.removeEventListener('resize', @resizeListener)

  componentWillUpdate: (nextProps, nextState) ->
    if _.isEqual(@state.windowEl, nextState.windowEl)
      if @state.resizing.height or @state.resizing.width
        nextState.resizing.height = false
        nextState.resizing.width = false
    else
      nextState.resizing.height = not (@state.windowEl.height is nextState.windowEl.height)
      nextState.resizing.width = not (@state.windowEl.width is nextState.windowEl.width)

  resizeEffect: (resizeEvent) ->
    @setSizeState(resizeEvent)
    @_resizeListener?(resizeEvent)

  _getWindowSize: ->
    width = window.innerWidth
    height = window.innerHeight

    {width, height}

  _getComponentSize: ->
    componentNode = @getDOMNode()

    width: componentNode.offsetWidth
    height: componentNode.offsetHeight

  setInitialSize: ->
    windowEl = @_getWindowSize()
    componentEl = @_getComponentSize()

    sizesInitial = {windowEl, componentEl}

    @setState({sizesInitial, windowEl, componentEl})

  setSizeState: (resizeEvent) ->
    windowEl = @_getWindowSize()
    componentEl = @_getComponentSize()

    @setState({windowEl, componentEl})
