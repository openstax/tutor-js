React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'
_ = require 'underscore'


TutorPopover = React.createClass
  displayName: 'TutorPopover'

  getInitialState: ->
    firstShow: true
    placement: 'right'
    show: false
    scrollable: false
    imagesLoading: []

  propTypes: ->
    content: React.PropTypes.node.isRequired
    popoverProps: React.PropTypes.object
    contentProps: React.PropTypes.object
    overlayProps: React.PropTypes.object
    windowImpl: React.PropTypes.object
    maxHeightMultiplier: React.PropTypes.number
    maxWidthMultiplier: React.PropTypes.number

  getDefaultProps: ->
    maxHeightMultiplier: 0.75
    maxWidthMultiplier: 0.75
    windowImpl: window

  componentDidMount: ->
    @setPlacement()

  checkOverlay: ->
    @checkImages()

  checkImages: ->
    # Make sure the popover re-positions after the image loads
    if @refs.popcontent? and @state.firstShow
      images = @getImages()

      imagesLoading = _.map images, (image, iter) =>
        unless image.onload? or image.complete
          image.onload = _.partial(@imageLoaded, iter)
        return not image.complete

      @setState(imagesLoading: imagesLoading, firstShow: false)

  getImages: ->
    content = @refs.popcontent
    content.querySelectorAll('img')

  imageLoaded: (iter) ->
    {imagesLoading} = @state

    currentImageStatus = _.clone(imagesLoading)
    currentImageStatus[iter] = false

    @setState(imagesLoading: currentImageStatus)

  areImagesLoading: ->
    _.compact(@state.imagesLoading).length isnt 0

  updateOverlayPositioning: ->
    {windowImpl} = @props
    # updates popper positioning function to
    # explicitly set height so that content
    # can inherit the height for scrolling content
    # @refs.popper.updateOverlayPosition = =>

    viewer = ReactDOM.findDOMNode(@refs.popover)
    {height, width} = viewer.getBoundingClientRect()

    scrollable = false

    if height > windowImpl.innerHeight
      scrollable = true
      viewer.style.height = @props.maxHeightMultiplier * windowImpl.innerHeight + 'px'

    if width > windowImpl.innerWidth
      scrollable = true
      viewer.style.width = @props.maxWidthMultiplier * windowImpl.innerWidth + 'px'

    if @state.scrollable and not scrollable
      viewer.style.height = 'auto'
      viewer.style.width = 'auto'

    @setState({scrollable})


  setPlacement: ->
    placement = @guessPlacement()
    @setState({placement}) unless @state.placement is placement

  guessPlacement: ->
    window.refs = @refs
    {windowImpl} = @props
    trigger = ReactDOM.findDOMNode(@refs.popper).getBoundingClientRect().left
    midWindow = windowImpl.innerWidth / 2
    if trigger > midWindow then 'left' else 'right'

  show: ->
    @setPlacement()
    @setState(show: true)
    @refs.popper.show()

  hide: ->
    @setState(show: false)
    @refs.popper.hide()

  render: ->
    {children, content, popoverProps, overlayProps, id} = @props
    {scrollable, placement, delayShow} = @state

    if scrollable
      popoverProps = _.clone(popoverProps or {})
      popoverProps.className ?= ''
      popoverProps.className += ' scrollable'

    if @areImagesLoading()
      contentClassName = 'image-loading'

    content = React.cloneElement(content, className: contentClassName)

    popoverId = if id then "tutor-popover-#{id}" else "tutor-popover-#{@_reactInternalInstance._rootNodeID}"

    overlayProps = _.extend({}, overlayProps, {onEnter: @checkOverlay, onEntering: @updateOverlayPositioning})

    popover = <BS.Popover
      {...popoverProps}
      id={popoverId}
      ref='popover'>
      <div ref='popcontent'>
        {content}
      </div>
    </BS.Popover>

    <BS.OverlayTrigger
      {...overlayProps}
      placement={placement}
      overlay={popover}
      ref='popper'>
      {children}
    </BS.OverlayTrigger>

module.exports = TutorPopover
