React = require 'react'
_ = require 'underscore'

module.exports =
  propTypes:
    resizeThrottle: React.PropTypes.number

  getDefaultProps: ->
    resizeThrottle: 200

  getInitialState: ->
    $window: {}
    $component: {}
    _initial: {}
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
    if _.isEqual(@state.$window, nextState.$window)
      if @state.resizing.height or @state.resizing.width
        nextState.resizing.height = false
        nextState.resizing.width = false
    else
      nextState.resizing.height = not (@state.$window.height is nextState.$window.height)
      nextState.resizing.width = not (@state.$window.width is nextState.$window.width)

  resizeEffect: (resizeEvent) ->
    @setSizeState(resizeEvent)
    @_resizeListener?(resizeEvent)

  _getWindowSize: ->
    width = window.innerWidth
    height = window.innerHeight
    $window = {width, height}

  _getComponentSize: ->
    componentNode = @getDOMNode()
    $component =
      width: componentNode.offsetWidth
      height: componentNode.offsetHeight

  setInitialSize: ->
    $window = @_getWindowSize()
    $component = @_getComponentSize()

    _initial = {$window, $component}

    @setState({_initial, $window, $component})

  setSizeState: (resizeEvent) ->
    $window = @_getWindowSize()
    $component = @_getComponentSize()

    @setState({$window, $component})
