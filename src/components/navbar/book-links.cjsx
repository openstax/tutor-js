React = require 'react'
BS = require 'react-bootstrap'

{CourseStore} = require '../../flux/course'

BookLinks = React.createClass
  goToPdf: ->
    course = CourseStore.get(@props.courseId)
    window.open(course.book_pdf_url, 'cc-pdf-link')

  goToWebview: ->
    course = CourseStore.get(@props.courseId)
    window.open(course.webview_url, 'cc-webview-link')

  render: ->
    return null unless CourseStore.get(@props.courseId)?.is_concept_coach
    <li className='book-links'>
      <BS.Button bsStyle='link' onClick={@goToPdf}>
        Book PDF
      </BS.Button>
      <BS.Button bsStyle='link' onClick={@goToWebview}>
        Webview <i className='fa fa-external-link' />
      </BS.Button>
    </li>



module.exports = BookLinks
