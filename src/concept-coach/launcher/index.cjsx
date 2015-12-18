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

  launch: ->
    {isLaunching} = @state
    return if isLaunching
    @setState(isLaunching: true)
    channel.emit('launcher.clicked')

  close: ->
    @setState(isLaunching: false)

  shouldComponentUpdate: (nextProps, nextState) ->
    @state.isLaunching isnt nextState.isLaunching

  componentWillMount: ->
    channel.on 'coach.unmount.success', @close

  componentWillUnmount: ->
    channel.off 'coach.unmount.success', @close

  render: ->
    {isLaunching} = @state
    height = '388px'
    height = "#{window.innerHeight}px" if isLaunching

    classes = classnames 'concept-coach-launcher',
      launching: isLaunching

    <div className='concept-coach-launcher-wrapper'>
      <div className={classes} onClick={@launch}>
        <BackgroundAndDesk height={height}/>
        <LaptopAndMug/>

        <BS.Button bsStyle='primary' bsSize='large'>Launch Concept Coach</BS.Button>

      </div>
    </div>

module.exports = {Launcher}