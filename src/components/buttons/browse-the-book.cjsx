React = require 'react'
BS = require 'react-bootstrap'
{CourseStore} = require '../../flux/course'

module.exports = React.createClass
  displayName: 'BrowseTheBook'

  contextTypes:
    router: React.PropTypes.func

  getDefaultProps: ->
    bsStyle: 'primary'

  propTypes:
    courseId:  React.PropTypes.string
    chapterId: React.PropTypes.number
    sectionId: React.PropTypes.number
    page:      React.PropTypes.string
    unstyled:  React.PropTypes.bool
    bsStyle:   React.PropTypes.string

  render: ->
    courseId = @props.courseId or @context.router.getCurrentParams().courseId
    # the router is smart enough to figure out which props are present and return the best route
    linkType = if @props.page then 'viewReferenceBookPage' else
      if @props.section then 'viewReferenceBookSection' else 'viewReferenceBook'
    course = CourseStore.get(@props.courseId)
    link = @context.router.makeHref( linkType, bookId: course.book_id, cnxId: @props.page, section:@props.section )
    linkProps = {target:'_blank', className:'view-reference-guide', href: link}
    text = @props.children or 'Browse the Book'
    if @props.unstyled
      <a {...linkProps}>{text}</a>
    else
      <BS.Button bsStyle={@props.bsStyle} {...linkProps}>{text}</BS.Button>
