React = require 'react'
BS = require 'react-bootstrap'

module.exports = React.createClass
  displayName: 'BrowseTheBookButton'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired
    page:     React.PropTypes.string

  render: ->
    link = if @props.page
      @context.router.makeHref('viewReferenceBookPage',
        {courseId: @props.courseId, cnxId:@props.page})
    else
      @context.router.makeHref('viewReferenceBook',
        {courseId: @props.courseId})
    <BS.Button
      bsStyle='primary'
      target="_blank"
      className='view-reference-guide'
      href={link}
    >
      Browse the Book
    </BS.Button>
