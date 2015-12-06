React = require 'react'
BS = require 'react-bootstrap'

{CourseStore} = require '../../flux/course'

BookLinks = React.createClass

  PropTypes:
    courseId: React.PropTypes.string

  render: ->
    course = CourseStore.get(@props.courseId)
    return null unless course?.is_concept_coach
    links = []
    if course.book_pdf_url
      links.push(
        <a key='pdf' target='_blank' href={course.book_pdf_url}>
          Book PDF
        </a>
      )
    if course.webview_url
      links.push(
        <a key='webview' target='_blank' href={course.webview_url}>
          Webview <i className='fa fa-external-link' />
        </a>
      )

    window.open(course.webview_url, 'cc-webview-link')

    <li className='book-links'>
      {links}
    </li>



module.exports = BookLinks
