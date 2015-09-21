React = require 'react'
LoadableItem = require './loadable-item'
TutorPopover = require './tutor-popover'

_ = require 'underscore'
S = require '../helpers/string'

{MediaStore} = require '../flux/media'
{ReferenceBookPageStore, ReferenceBookPageActions} = require '../flux/reference-book-page'


MediaPreview = React.createClass
  displayName: 'MediaPreview'
  getInitialState: ->
    popped: false
    stick: false
    media: null

  propTypes:
    mediaId: React.PropTypes.string.isRequired
    media: React.PropTypes.object
    buffer: React.PropTypes.number

  getDefaultProps: ->
    buffer: 160

  componentWillMount: ->
    {mediaId, cnxId} = @props
    media = MediaStore.get(mediaId)
    @updateMedia(media) if media?

    unless media? or ReferenceBookPageStore.isLoading(cnxId) or ReferenceBookPageStore.isLoaded(cnxId)
      ReferenceBookPageActions.load(cnxId)
      MediaStore.once("loaded.#{mediaId}", @updateMedia)

  updateMedia: (media) ->
    @setState({media})

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

  onMouseEnter: (mouseEvent) ->
    mouseEvent.preventDefault()
    @showMedia()

  onMouseLeave: (mouseEvent) ->
    mouseEvent.preventDefault()
    @hideMedia()

  getOverlayProps: ->
    _.pick(@props, 'containerPadding')

  getLinkProps: (otherProps) ->
    {mediaId, media, bookHref} = @props

    otherPropTypes = _.chain(otherProps)
      .keys()
      .union(['mediaId', 'children', 'media', 'buffer'])
      .value()

    # most props should pass on
    linkProps = _.omit(@props, otherPropTypes)
    linkProps['data-targeted'] = 'media'

    if media?
      linkProps.href = "##{mediaId}"
    else
      linkProps.href = bookHref
      linkProps.href += "##{mediaId}" if mediaId
      linkProps.target = '_blank'

    linkProps.onMouseEnter = @onMouseEnter
    linkProps.onMouseLeave = @onMouseLeave

    defaultClassName = 'media-preview-link'
    linkProps.className += " #{defaultClassName}" if linkProps.className?
    linkProps.className ?= defaultClassName

    linkProps

  render: ->
    {mediaId, children, bookHref} = @props
    {media} = @state

    overlayProps = @getOverlayProps()
    linkProps = @getLinkProps(overlayProps)
    if media?
      contentHtml = media.html
      contentProps =
        className: 'media-preview-content'
        ref: 'viewer'
      popoverProps =
        'data-content-type': media.name
        className: 'media-preview'
        ref: 'popover'

      allProps = {contentHtml, overlayProps, contentProps, popoverProps, linkProps}

      linkText = children unless children is '[link]'
      linkText ?= S.capitalize(media.name)

      <TutorPopover {...allProps} ref='overlay'>{linkText}</TutorPopover>
    else
      linkProps = _.omit(linkProps, 'onMouseEnter', 'onMouseLeave')
      <a {...linkProps}>{children}</a>

module.exports = {MediaPreview}
  