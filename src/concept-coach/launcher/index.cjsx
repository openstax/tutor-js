React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'

{BackgroundAndDesk, LaptopAndMug} = require './items'

{channel} = require '../model'


Launcher = React.createClass
  displayName: 'Launcher'
  getInitialState: ->
    isLaunching: false
    isClosing: false

  launch: ->
    {isClosing} = @state
    return if isClosing
    @setState(isLaunching: true)
    channel.emit('launcher.clicked')

  close: ->
    @setState(isClosing: true, isLaunching: false)

  delayedClose: ->
    _.delay =>
      @setState(isClosing: false)
    , 1000

  shouldComponentUpdate: (nextProps, nextState) ->
    @state.isClosing isnt nextState.isClosing or @state.isLaunching isnt nextState.isLaunching

  componentDidUpdate: ->
    {isLaunching, isClosing} = @state
    @delayedClose() if isClosing and not isLaunching

  componentWillMount: ->
    channel.on 'coach.unmount.success', @close

  componentWillUnmount: ->
    channel.off 'coach.unmount.success', @close

  render: ->
    {isLaunching, isClosing} = @state
    height = '388px'
    height = "#{window.innerHeight}px" if isLaunching and not isClosing

    classes = classnames 'concept-coach-launcher',
      launching: isLaunching
      closing: isClosing

    <div className='concept-coach-launcher-wrapper'>
      <div className={classes} onClick={@launch}>
        <BackgroundAndDesk height={height}/>
        <LaptopAndMug/>

        <BS.Button bsStyle='primary' bsSize='large'>Launch Concept Coach</BS.Button>

      </div>
    </div>

module.exports = {Launcher}