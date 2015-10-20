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
    componentNode = @getDOMNode()

    width: componentNode.offsetWidth
    height: componentNode.offsetHeight

  setInitialSize: ->
    windowEl = @_getWindowSize()
    componentEl = @_getComponentSize()

    sizesInitial = {windowEl, componentEl}

    @setState({sizesInitial, windowEl, componentEl})
