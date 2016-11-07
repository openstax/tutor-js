_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
{Redirect, Link} = require 'react-router'

Router = require '../helpers/router'

WindowHelpers = require '../helpers/window'

{CourseListingActions, CourseListingStore} = require '../flux/course-listing'
{CourseStore} = require '../flux/course'
{RefreshButton} = require 'shared'
EmptyCourses    = require './course-listing/empty'
CourseData = require './course-data-mixin'


CourseLink = ({courseId, name, is_concept_coach}) ->
  props = CourseData.getCourseDataProps(courseId)
  <BS.Row data-course-id={courseId}>
    <BS.Col {...props} className='tutor-booksplash-course-item' xs={12}>
      <Link
          className='tutor-course-item'
          to={Router.makePathname('dashboard', {courseId: courseId})}
      >
        {name}
      </Link>
      <div className='course-type-flag'>
        {if is_concept_coach then'Concept Coach' else 'Tutor'}
      </div>
    </BS.Col>
  </BS.Row>

CourseLink.displayName = "CourseLink"

CourseListing = React.createClass
  displayName: 'CourseListing'

  contextTypes:
    router: React.PropTypes.object

  render: ->
    courses = CourseListingStore.allCoursesWithRoles()
    if courses.length is 0
      <EmptyCourses />
    else if courses.length is 1
      <Redirect to={Router.makePathname('dashboard', {courseId: courses[0].id})} />
    else
      <div className='course-listing '>
        <div className='-course-list'>
          {for course in courses
            <CourseLink key={course.id}
              courseId={course.id}
              is_concept_coach={course.is_concept_coach}
              name={course.name} />}
        </div>
      </div>



module.exports = CourseListing
