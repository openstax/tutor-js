React = require 'react'
ReactDOM = require 'react-dom'
TutorPopover = require './tutor-popover'
{ArbitraryHtmlAndMath} = require 'shared'

_ = require 'underscore'
S = require '../helpers/string'

{MediaStore} = require '../flux/media'


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
    originalHref: React.PropTypes.string

  getDefaultProps: ->
    buffer: 160
    shouldLinkOut: false
    windowImpl: window
    trigger: 'focus'

  componentWillMount: ->
    {mediaId, cnxId} = @props
    media = MediaStore.get(mediaId)
    @updateMedia(media) if media?

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
    mediaRect = mediaDOMOnParent?.getBoundingClientRect()

    0 <= (mediaRect.top + buffer) <= windowImpl.innerHeight

  highlightMedia: ->
    {mediaDOMOnParent} = @props
    mediaDOMOnParent?.classList.add('link-target')

  unhighlightMedia: ->
    {mediaDOMOnParent} = @props
    mediaDOMOnParent?.classList.remove('link-target')

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
    @hideMedia() if @isMouseExited(mouseEvent)

  # check that mouse has exited both the link and the overlay
  isMouseExited: (mouseEvent) ->
    return true unless mouseEvent.relatedTarget?.nodeType? and @refs.overlay.refs.popover?
    linkDOM = ReactDOM.findDOMNode(@refs.overlay.refs.popper)
    popoverDOM = ReactDOM.findDOMNode(@refs.overlay.refs.popover)
    not (popoverDOM.contains(mouseEvent.relatedTarget) or linkDOM.isEqualNode(mouseEvent.relatedTarget))

  getOverlayProps: ->
    _.pick(@props, 'containerPadding', 'trigger')

  getLinkProps: (otherProps) ->
    {mediaId, mediaDOMOnParent, bookHref, shouldLinkOut, originalHref} = @props
    {media} = @state

    otherPropTypes = _.chain(otherProps)
      .keys()
      .union(['mediaId', 'children', 'mediaDOMOnParent', 'buffer'])
      .union(_.keys(@constructor.propTypes))
      .value()

    # most props should pass on
    linkProps = _.omit(@props, otherPropTypes)
    linkProps['data-targeted'] = 'media'

    if mediaDOMOnParent?
      linkProps.href = "##{mediaId}"
    else if (media and shouldLinkOut) # or not media
      linkProps.href = bookHref
      linkProps.href += "##{mediaId}" if mediaId
      linkProps.target = '_blank'
    else if not media
      linkProps.href = originalHref
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
      popoverProps =
        'data-content-type': media.name
        className: 'media-preview'
        ref: 'popover'
        onMouseLeave: @onMouseLeave

      content = <ArbitraryHtmlAndMath {...contentProps} html={contentHtml}/>
      allProps = {content, overlayProps, popoverProps, windowImpl}

      linkText = children unless children is '[link]'
      linkText ?= "See " + S.capitalize(media.name)

      <TutorPopover {...allProps} ref='overlay'>
        <a {...linkProps}>{linkText}</a>
      </TutorPopover>
    else
      linkProps = _.omit(linkProps, 'onMouseEnter', 'onMouseLeave')
      <a {...linkProps}>{children}</a>

module.exports = {MediaPreview}
