React = require 'react'
ReactDOM = require 'react-dom'
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

  componentWillMount: ->
    # need to define @resizeListener so that we can throttle resize effect
    # and have access to @state.resizeThrottle or @props.resizeThrottle
    @resizeListener = _.throttle(@resizeEffect, @state.resizeThrottle or @props.resizeThrottle)

  componentDidMount: ->
    _.defer(@setInitialSize)
    window.addEventListener('resize', @resizeListener)

  componentWillUnmount: ->
    window.removeEventListener('resize', @resizeListener)

  resizeEffect: (resizeEvent) ->
    windowEl = @_getWindowSize()
    componentEl = @_getComponentSize()
    sizes = {windowEl, componentEl}

    @setState(sizes)
    @_resizeListener?(sizes, resizeEvent)

  _getWindowSize: ->
    width = window.innerWidth
    height = window.innerHeight

    {width, height}

  _getComponentSize: ->
    return {height: 0, width: 0} unless @isMounted()
    componentNode = ReactDOM.findDOMNode(@)
    width: componentNode.offsetWidth
    height: componentNode.offsetHeight

  setInitialSize: ->
    return unless @isMounted()
    windowEl = @_getWindowSize()
    componentEl = @_getComponentSize()

    sizesInitial = {windowEl, componentEl}

    @setState({sizesInitial, windowEl, componentEl})
