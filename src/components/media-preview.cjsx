React = require 'react'
TutorPopover = require './tutor-popover'

_ = require 'underscore'
S = require '../helpers/string'

{MediaStore} = require '../flux/media'


MediaPreview = React.createClass
  displayName: 'MediaPreview'
  getInitialState: ->
    popped: false
    stick: false

  propTypes:
    mediaId: React.PropTypes.string.isRequired
    buffer: React.PropTypes.number
    onClick: React.PropTypes.func
    media: React.PropTypes.object

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

  stickMedia: ->
    @setState(stick: true)
    unless @state.popped
      @setState(popped: true)
      @refs.overlay.show()

  showMedia: ->
    return if @state.stick
    shouldPop = @checkShouldPop()
    if shouldPop
      unless @state.popped
        @setState(popped: true)
        @refs.overlay.show()
    else
      @highlightMedia()

  hideMedia: ->
    if @state.popped
      if not @state.stick
        @setState(popped: false)
        @refs.overlay.hide()
    else
      @unhighlightMedia()

  onBlur: (mouseEvent) ->
    if @state.stick
      @setState(stick: false, popped: false)
      @refs.overlay.hide()

  onClick: (mouseEvent) ->
    # Go to target as usual if media is on page
    # Take out if we just want the media to stick on click
    return if @props.media

    mouseEvent.preventDefault()
    @stickMedia()

  onMouseEnter: (mouseEvent) ->
    mouseEvent.preventDefault()
    @showMedia()

  onMouseLeave: (mouseEvent) ->
    mouseEvent.preventDefault()
    @hideMedia()

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

    linkProps.onClick = @onClick
    linkProps.onBlur = @onBlur
    linkProps.onMouseEnter = @onMouseEnter
    linkProps.onMouseLeave = @onMouseLeave

    defaultClassName = 'media-preview-link'
    linkProps.className += " #{defaultClassName}" if linkProps.className?
    linkProps.className ?= defaultClassName

    linkProps

  render: ->
    {mediaId, children} = @props
    media = MediaStore.get(mediaId)

    contentHtml = media.html
    overlayProps = @getOverlayProps()
    linkProps = @getLinkProps(overlayProps)
    contentProps =
      className: 'media-preview-content'
      ref: 'viewer'
    popoverProps =
      'data-content-type': media.name
      className: 'media-preview'
      ref: 'popover'
    scrollable = media.name is 'table'

    allProps = {contentHtml, overlayProps, contentProps, popoverProps, linkProps, scrollable}

    linkText = children unless children is '[link]'
    linkText ?= S.capitalize(media.name)

    <TutorPopover {...allProps} ref='overlay'>{linkText}</TutorPopover>

module.exports = MediaPreview
  