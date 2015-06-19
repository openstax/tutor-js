React = require 'react'
_ = require 'underscore'

module.exports =
  propTypes:
    resizeThrottle: React.PropTypes.number

  getDefaultProps: ->
    resizeThrottle: 200

  getInitialState: ->
    $window: {}

  componentWillMount: ->
    # need to define @resizeListener so that we can throttle resize effect
    # and have access to @state.resizeThrottle or @props.resizeThrottle
    @resizeListener = _.throttle(@resizeEffect, @state.resizeThrottle or @props.resizeThrottle)

  componentDidMount: ->
    @_setSizeState()
    window.addEventListener('resize', @resizeListener)

  componentWillUnmount: ->
    window.removeEventListener('resize', @resizeListener)

  resizeEffect: (resizeEvent) ->
    @_setSizeState(resizeEvent)
    @_resizeListener?(resizeEvent)

  _setSizeState: (resizeEvent) ->
    width = window.innerWidth
    height = window.innerHeight
    $window = {width, height}

    @setState({$window})
