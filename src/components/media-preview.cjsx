React = require 'react'
BS = require 'react-bootstrap'

_ = require 'underscore'
S = require '../helpers/string'

ArbitraryHtml = require './html'
{MediaStore} = require '../flux/media'


MediaPreview = React.createClass
  displayName: 'MediaPreview'
  getInitialState: ->
    popMedia: false
    modalMedia: false
    firstView: true
    placement: 'right'

  propTypes:
    mediaId: React.PropTypes.string.isRequired
    buffer: React.PropTypes.number
    onClick: React.PropTypes.func

  getDefaultProps: ->
    buffer: 160
    onClick: (clickEvent) ->
      # if desired, on click could trigger a modal for example.
      # need to talk to UI
      clickEvent.preventDefault()

  componentDidMount: ->
    # tables should be scroll-able
    media = MediaStore.get(@props.mediaId)
    @updateOverlayPositioning()

  componentDidUpdate: ->
    # Make sure the popover re-positions after the image loads
    if @refs.viewer? and @state.firstView
      viewer = @refs.viewer.getDOMNode()
      images = viewer.querySelectorAll('img')
      for image in images
        image.onload = @imageLoaded unless image.onload?

  setPlacement: ->
    placement = @guessPlacement()
    @setState({placement}) unless @state.placement is placement

  guessPlacement: ->
    {overlayLeft} = @refs.popper.calcOverlayPosition()
    midWindow = window.innerWidth/2
    if overlayLeft > midWindow then 'left' else 'right'

  imageLoaded: ->
    @refs.popper.updateOverlayPosition()
    @setState({firstView: false})

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

  checkShouldPop: ->
    return true unless @props.media
    not @isMediaInViewport()

  isMediaInViewport: ->
    {media, buffer} = @props
    mediaRect = media.getBoundingClientRect()

    0 <= (mediaRect.top + buffer) <= window.innerHeight

  highlightMedia: ->
    {media} = @props
    media.classList.add('target')

  unhighlightMedia: ->
    {media} = @props
    media.classList.remove('target')

  popMedia: ->
    @setPlacement()
    @refs.popper.show()

  unpopMedia: ->
    @refs.popper.hide()

  componentWillUpdate: (nextProps, nextState) ->
    if nextState.popMedia isnt @state.popMedia
      @popMedia() if nextState.popMedia
      @unpopMedia() if not nextState.popMedia

  onMouseEnter: (mouseEvent) ->
    mouseEvent.preventDefault()
    popMedia = @checkShouldPop()
    @highlightMedia() unless popMedia
    @setState({popMedia})

  onMouseLeave: (mouseEvent) ->
    mouseEvent.preventDefault()
    @unhighlightMedia() unless @state.popMedia
    @setState(popMedia: false)

  getOverlayProps: ->
    _.pick(@props, 'containerPadding')

  getLinkProps: (otherProps) ->
    {mediaId} = @props

    otherPropTypes = _.chain(otherProps)
      .keys()
      .union(['mediaId', 'children', 'media'])
      .value()

    # most props should pass on
    linkProps = _.omit(@props, otherPropTypes)
    linkProps.href = "##{mediaId}"
    linkProps['data-targeted'] = 'media'

    linkProps.onMouseEnter = @onMouseEnter
    linkProps.onMouseLeave = @onMouseLeave

    defaultClassName = 'media-preview-link'
    linkProps.className += " #{defaultClassName}" if linkProps.className?
    linkProps.className ?= defaultClassName

    linkProps

  render: ->
    {mediaId, children} = @props

    overlayProps = @getOverlayProps()
    linkProps = @getLinkProps(overlayProps)

    media = MediaStore.get(mediaId)
    mediaPop = <BS.Popover
      data-content-type={media.name}
      className='media-preview'
      ref='popover'>
      <ArbitraryHtml html={media.html} className='media-preview-content' ref='viewer'/>
    </BS.Popover>

    linkText = children unless children is '[link]'
    linkText ?= S.capitalize(media.name)

    <BS.OverlayTrigger
      {...overlayProps}
      placement={@state.placement}
      overlay={mediaPop}
      trigger='manual'
      ref='popper'>
      <a {...linkProps}>{linkText}</a>
    </BS.OverlayTrigger>

module.exports = MediaPreview
  