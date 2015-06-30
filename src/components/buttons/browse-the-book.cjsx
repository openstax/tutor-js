React = require 'react'
BS = require 'react-bootstrap'

module.exports = React.createClass
  displayName: 'BrowseTheBook'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId:  React.PropTypes.string
    chapterId: React.PropTypes.number
    sectionId: React.PropTypes.number
    page:      React.PropTypes.string
    unstyled:  React.PropTypes.bool

  render: ->
    courseId = @props.courseId or @context.router.getCurrentParams().courseId
    # the router is smart enough to figure out which props are present and return the best route
    linkType = if @props.page then 'viewReferenceBookPage' else
      if @props.section then 'viewReferenceBookSection' else 'viewReferenceBook'
    link = @context.router.makeHref( linkType, courseId: courseId, cnxId: @props.page, section:@props.section )
    linkProps = {target:'_blank', className:'view-reference-guide', href: link}
    text = @props.children or 'Browse the Book'
    if @props.unstyled
      <a {...linkProps}>{text}</a>
    else
      <BS.Button bsStyle='primary', {...linkProps}>{text}</BS.Button>
