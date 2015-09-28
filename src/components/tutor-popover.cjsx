React = require 'react/addons'
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
    @updateOverlayPositioning()

  componentDidUpdate: ->
    # Make sure the popover re-positions after the image loads
    if @refs.popcontent? and @state.firstShow
      content = @refs.popcontent.getDOMNode()
      images = content.querySelectorAll('img')

      imagesLoading = _.map images, (image, iter) =>
        unless image.onload? or image.complete
          image.onload = _.partial(@imageLoaded, iter)
          return true
        return false

      @setState(imagesLoading: imagesLoading, firstShow: false)

  imageLoaded: (iter) ->
    return unless @isMounted()
    @refs.popper?.updateOverlayPosition()
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
    updateOverlayPosition = @refs.popper.updateOverlayPosition
    @refs.popper.updateOverlayPosition = =>
      updateOverlayPosition()
      viewer = @refs.popper.getOverlayDOMNode()
      {height, width} = viewer.getBoundingClientRect()

      scrollable = false

      if height > windowImpl.innerHeight
        scrollable = true
        viewer.style.height = @props.maxHeightMultiplier * windowImpl.innerHeight + 'px'
        updateOverlayPosition()

      if width > windowImpl.innerWidth
        scrollable = true
        viewer.style.width = @props.maxWidthMultiplier * windowImpl.innerWidth + 'px'
        updateOverlayPosition()

      if @state.scrollable and not scrollable
        viewer.style.height = 'auto'
        viewer.style.width = 'auto'

      @setState({scrollable})
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
    {children, content, popoverProps, overlayProps} = @props
    {scrollable, placement} = @state

    if scrollable
      popoverProps = _.clone(popoverProps or {})
      popoverProps.className ?= ''
      popoverProps.className += ' scrollable'

    if @areImagesLoading()
      contentClassName = 'image-loading'

    content = React.addons.cloneWithProps(content, className: contentClassName)

    popover = <BS.Popover
      {...popoverProps}
      ref='popover'>
      <div ref='popcontent'>
        {content}
      </div>
    </BS.Popover>

    <BS.OverlayTrigger
      {...overlayProps}
      placement={placement}
      overlay={popover}
      trigger='manual'
      ref='popper'>
      {children}
    </BS.OverlayTrigger>

module.exports = TutorPopover
