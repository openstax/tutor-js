React = require 'react'
BS = require 'react-bootstrap'
TutorLink = require '../link'

{CourseStore} = require '../../flux/course'

BookLinks = React.createClass

  PropTypes:
    courseId: React.PropTypes.string

  render: ->
    course = CourseStore.get(@props.courseId)
    return null unless course?.is_concept_coach

    {onItemClick} = @props

    links = []
    if course.book_pdf_url
      links.push(
        <a key='pdf' target='_blank' href={course.book_pdf_url}>
          Homework PDF
        </a>
      )
    if course.webview_url
      links.push(
        <a key='webview' target='_blank' href={course.webview_url}>
          Online Book <i className='fa fa-external-link' />
        </a>
      )
    links.push(
      <TutorLink
        key='assignment'
        to='viewAssignmentLinks'
        params={courseId: @props.courseId}
        onClick={onItemClick}>Assignment Links</TutorLink>
    )

    <li className='book-links'>
      {links}
    </li>



module.exports = BookLinks
