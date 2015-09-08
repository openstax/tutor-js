React = require 'react'
BS = require 'react-bootstrap'

_ = require 'underscore'
S = require '../helpers/string'

ArbitraryHtml = require './html'
{MediaStore} = require '../flux/media'


MediaPreview = React.createClass
  displayName: 'MediaPreview'
  propTypes:
    mediaId: React.PropTypes.string.isRequired
    onClick: React.PropTypes.func

  getDefaultProps: ->
    onClick: (clickEvent) ->
      # if desired, on click could trigger a modal for example.
      # need to talk to UI
      clickEvent.preventDefault()

  getOverlayProps: ->
    _.pick(@props, 'placement', 'trigger', 'containerPadding')

  getLinkProps: (otherProps) ->
    {mediaId} = @props

    otherPropTypes = _.chain(otherProps)
      .keys()
      .union(['mediaId', 'children'])
      .value()

    # most props should pass on
    linkProps = _.omit(@props, otherPropTypes)
    linkProps.href = "##{mediaId}"
    linkProps['data-targeted'] = 'media'

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
      <ArbitraryHtml html={media.html} className='media-preview'/>
    </BS.Popover>

    linkText = children unless children is '[link]'
    linkText ?= S.capitalize(media.name)

    <BS.OverlayTrigger {...overlayProps} overlay={mediaPop}>
      <a {...linkProps}>{linkText}</a>
    </BS.OverlayTrigger>

module.exports = MediaPreview
  