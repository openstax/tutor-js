_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
WindowHelpers = require '../helpers/window'

{CourseListingActions, CourseListingStore} = require '../flux/course-listing'
{CourseStore} = require '../flux/course'
{RefreshButton} = require 'shared'
EmptyCourses    = require './course-listing/empty'
CourseData = require './course-data-mixin'


CourseLink = ({course}) ->
  props = CourseData.getCourseDataProps(course.id)
  <BS.Row key="course-#{course.id}">
    <BS.Col {...props} className='tutor-booksplash-course-item' xs={12}>
      <Router.Link
          className='tutor-course-item'
          to="/courses/#{course.id}"
      >
        {course.name}
      </Router.Link>
      <div className='course-type-flag'>
        {if course.is_concept_coach then'Concept Coach' else 'Tutor'}
      </div>
    </BS.Col>
  </BS.Row>

CourseListing = React.createClass
  displayName: 'CourseListing'

  contextTypes:
    router: React.PropTypes.object

  render: ->
    courses = CourseListingStore.allCoursesWithRoles()
    body = if courses.length
      <div className='-course-list'>
        {for course in courses
          <CourseLink key={course.id} course={course} />}
      </div>
    else
      <EmptyCourses />

    unless CourseListingStore.isLoaded()
      refreshBtn = <RefreshButton/>

    <div className='course-listing '>
      {body}
      {refreshBtn}
    </div>

module.exports = {CourseListing}
