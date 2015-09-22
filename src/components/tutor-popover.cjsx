React = require 'react'
BS = require 'react-bootstrap'
ArbitraryHtml = require './html'

TutorPopover = React.createClass
  displayName: 'TutorPopover'

  getInitialState: ->
    firstShow: true
    placement: 'right'
    show: false
    scrollable: false

  propTypes: ->
    contentHtml: React.PropTypes.string.isRequired
    popoverProps: React.PropTypes.object
    contentProps: React.PropTypes.object
    overlayProps: React.PropTypes.object
    linkProps: React.PropTypes.object
    windowImpl: React.PropTypes.object
    maxHeightMultiplier: React.PropTypes.number

  getDefaultProps: ->
    maxHeightMultiplier: 0.75
    windowImpl: window

  componentDidMount: ->
    @updateOverlayPositioning()

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
    {windowImpl} = @props
    # updates popper positioning function to
    # explicitly set height so that content
    # can inherit the height for scrolling content
    updateOverlayPosition = @refs.popper.updateOverlayPosition
    @refs.popper.updateOverlayPosition = =>
      updateOverlayPosition()
      viewer = @refs.popper.getOverlayDOMNode()
      {height} = viewer.getBoundingClientRect()

      if height > windowImpl.innerHeight
        @setState(scrollable: true)
        viewer.style.height = @props.maxHeightMultiplier * windowImpl.innerHeight + 'px'
        updateOverlayPosition()
      else if @state.scrollable
        @setState(scrollable: false)
        viewer.style.height = 'auto'
        updateOverlayPosition()

  setPlacement: ->
    placement = @guessPlacement()
    @setState({placement}) unless @state.placement is placement

  guessPlacement: ->
    {windowImpl} = @props
    {overlayLeft} = @refs.popper.calcOverlayPosition()
    midWindow = windowImpl.innerWidth / 2
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

    if @state.scrollable
      popoverProps ?= {}
      popoverProps.className ?= ''
      popoverProps.className += ' scrollable'

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
