React = require 'react'
BS = require 'react-bootstrap'
ArbitraryHtml = require './html'

TutorPopover = React.createClass
  displayName: 'TutorPopover'

  getInitialState: ->
    firstShow: true
    placement: 'right'
    show: false

  propTypes: ->
    contentHtml: React.PropTypes.string.isRequired
    popoverProps: React.PropTypes.object
    contentProps: React.PropTypes.object
    overlayProps: React.PropTypes.object
    linkProps: React.PropTypes.object
    scrollable: React.PropTypes.bool

  getDefaultProps: ->
    scrollable: false

  componentDidMount: ->
    @updateOverlayPositioning() if @props.scrollable

  componentDidUpdate: ->
    # Make sure the popover re-positions after the image loads
    if @refs.popcontent? and @state.firstShow
      content = @refs.popcontent.getDOMNode()
      images = content.querySelectorAll('img')
      for image in images
        image.onload = @imageLoaded unless image.onload?

  imageLoaded: ->
    @refs.popper.updateOverlayPosition()
    @setState({firstShow: false})

  updateOverlayPositioning: ->
    # updates popper positioning function to
    # explicitly set height so that content
    # can inherit the height for scrolling content
    updateOverlayPosition = @refs.popper.updateOverlayPosition
    @refs.popper.updateOverlayPosition = ->
      updateOverlayPosition()
      viewer = @getOverlayDOMNode()
      # set to auto first to get most natural height
      viewer.style.height = 'auto'
      {height} = viewer.getBoundingClientRect()
      # re-bound height so that content will inherit height
      viewer.style.height = "#{height}px"

  setPlacement: ->
    placement = @guessPlacement()
    @setState({placement}) unless @state.placement is placement

  guessPlacement: ->
    {overlayLeft} = @refs.popper.calcOverlayPosition()
    midWindow = window.innerWidth / 2
    if overlayLeft > midWindow then 'left' else 'right'

  show: ->
    @setPlacement()
    @setState(show: true)
    @refs.popper.show()

  hide: ->
    @setState(show: false)
    @refs.popper.hide()

  render: ->
    {children, contentHtml, popoverProps, contentProps, overlayProps, linkProps} = @props

    popover = <BS.Popover
      {...popoverProps}
      ref='popover'>
      <ArbitraryHtml {...contentProps} html={contentHtml} ref='popcontent'/>
    </BS.Popover>

    <BS.OverlayTrigger
      {...overlayProps}
      placement={@state.placement}
      overlay={popover}
      trigger='manual'
      ref='popper'>
      <a {...linkProps}>{children}</a>
    </BS.OverlayTrigger>

module.exports = TutorPopover
