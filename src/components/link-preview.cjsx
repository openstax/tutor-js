React = require 'react'
BS = require 'react-bootstrap'
ArbitraryHtml = require './html'
S = require '../helpers/string'

{MediaStore} = require '../flux/media'


LinkPreview = React.createClass
  displayName: 'LinkPreview'
  propTypes:
    mediaId: React.PropTypes.string.isRequired
  render: ->
    media = MediaStore.get(@props.mediaId)
    mediaPop = <BS.Popover>
      <ArbitraryHtml html={media.html} className='media-preview'/>
    </BS.Popover>

    hash = "##{@props.mediaId}"

    linkText = @props.children unless @props.children is '[link]'
    linkText ?= S.capitalize(media.name)

    <BS.OverlayTrigger trigger='hover' overlay={mediaPop} placement='bottom'>
      <a data-targeted='media' href={hash}>{linkText}</a>
    </BS.OverlayTrigger>

module.exports = LinkPreview
  