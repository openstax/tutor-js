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
    @makeDebouncedResizer()

  componentDidMount: ->
    @_setSizeState()
    window.addEventListener('resize', @resizeListener)

  componentWillUnmount: ->
    window.removeEventListener('resize', @resizeListener)

  makeDebouncedResizer: ->
    @resizeListener = _.throttle(@resizeEffect, @props.resizeThrottle)

  resizeEffect: (resizeEvent) ->
    @_setSizeState(resizeEvent)
    @_resizeListener?(resizeEvent)

  _setSizeState: (resizeEvent) ->
    width = window.innerWidth
    height = window.innerHeight
    $window = {width, height}

    @setState({$window})
