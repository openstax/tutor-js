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
    bookHref: React.PropTypes.string.isRequired
    cnxId: React.PropTypes.string.isRequired
    mediaDOMOnParent: React.PropTypes.object
    windowImpl: React.PropTypes.object
    buffer: React.PropTypes.number
    shouldLinkOut: React.PropTypes.bool

  getDefaultProps: ->
    buffer: 160
    shouldLinkOut: false
    windowImpl: window

  componentWillMount: ->
    {mediaId, cnxId} = @props
    media = MediaStore.get(mediaId)
    @updateMedia(media) if media?

    unless media? or ReferenceBookPageStore.isLoading(cnxId) or ReferenceBookPageStore.isLoaded(cnxId)
      ReferenceBookPageActions.load(cnxId)
      MediaStore.once("loaded.#{mediaId}", @updateMedia)

  componentWillUnmount: ->
    {mediaId} = @props
    MediaStore.off("loaded.#{mediaId}", @updateMedia)

  updateMedia: (media) ->
    @setState({media})

  checkShouldPop: ->
    return true unless @props.mediaDOMOnParent
    not @isMediaInViewport()

  isMediaInViewport: ->
    {mediaDOMOnParent, buffer, windowImpl} = @props
    mediaRect = mediaDOMOnParent.getBoundingClientRect()

    0 <= (mediaRect.top + buffer) <= windowImpl.innerHeight

  highlightMedia: ->
    {mediaDOMOnParent} = @props
    mediaDOMOnParent.classList.add('link-target')

  unhighlightMedia: ->
    {mediaDOMOnParent} = @props
    mediaDOMOnParent.classList.remove('link-target')

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
    {mediaId, mediaDOMOnParent, bookHref, shouldLinkOut} = @props
    {media} = @state

    otherPropTypes = _.chain(otherProps)
      .keys()
      .union(['mediaId', 'children', 'mediaDOMOnParent', 'buffer'])
      .value()

    # most props should pass on
    linkProps = _.omit(@props, otherPropTypes)
    linkProps['data-targeted'] = 'media'

    if mediaDOMOnParent?
      linkProps.href = "##{mediaId}"
    else if (media and shouldLinkOut) or not media
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
    {mediaId, children, bookHref, windowImpl} = @props
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

      allProps = {contentHtml, overlayProps, contentProps, popoverProps, windowImpl}

      linkText = children unless children is '[link]'
      linkText ?= S.capitalize(media.name)

      <TutorPopover {...allProps} ref='overlay'>
        <a {...linkProps}>{linkText}</a>
      </TutorPopover>
    else
      linkProps = _.omit(linkProps, 'onMouseEnter', 'onMouseLeave')
      <a {...linkProps}>{children}</a>

module.exports = {MediaPreview}
  