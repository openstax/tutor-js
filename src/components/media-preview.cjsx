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
  propTypes:
    mediaId: React.PropTypes.string.isRequired
    onClick: React.PropTypes.func

  componentDidUpdate: ->

    # Make sure the popover re-positions after the image loads
    if @refs.viewer? and @state.firstView
      viewer = @refs.viewer.getDOMNode()
      images = viewer.querySelectorAll('img')
      for image in images
        image.onload = @imageLoaded unless image.onload?

  imageLoaded: ->
    @refs.popper.updateOverlayPosition()
    @setState({firstView: false})

  getDefaultProps: ->
    buffer: 160
    onClick: (clickEvent) ->
      # if desired, on click could trigger a modal for example.
      # need to talk to UI
      clickEvent.preventDefault()

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

  componentWillUpdate: (nextProps, nextState) ->
    if nextState.popMedia isnt @state.popMedia
      @refs.popper.show() if nextState.popMedia
      @refs.popper.hide() if not nextState.popMedia

  onMouseEnter: ->
    popMedia = @checkShouldPop()
    @highlightMedia() unless popMedia
    @setState({popMedia})

  onMouseLeave: ->
    @unhighlightMedia() unless @state.popMedia
    @setState(popMedia: false)

  getOverlayProps: ->
    _.pick(@props, 'placement', 'containerPadding')

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
    mediaPop = <BS.Popover>
      <ArbitraryHtml html={media.html} className='media-preview' ref='viewer'/>
    </BS.Popover>

    linkText = children unless children is '[link]'
    linkText ?= S.capitalize(media.name)

    <BS.OverlayTrigger
      {...overlayProps}
      overlay={mediaPop}
      trigger='manual'
      ref='popper'>
      <a {...linkProps}>{linkText}</a>
    </BS.OverlayTrigger>

module.exports = MediaPreview
  