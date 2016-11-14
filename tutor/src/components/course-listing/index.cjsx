_ = require 'lodash'
React = require 'react'
BS = require 'react-bootstrap'
{Redirect} = require 'react-router'

Router = require '../../helpers/router'

{CourseListingStore} = require '../../flux/course-listing'
{CurrentUserStore} = require '../../flux/current-user'

{Course, CourseTeacher} = require './course'
EmptyCourses    = require './empty'
{CourseListingPast, CourseListingCurrent} = require './listings'

CourseListing = React.createClass
  displayName: 'CourseListing'

  contextTypes:
    router: React.PropTypes.object

  wrapCourseItem: (Item, course) ->
    <BS.Col key="course-listing-item-wrapper-#{course.id}" md={3} sm={4}>
      <Item course={course} />
    </BS.Col>

  shouldRedirect: (currentCourses) ->
    currentCourses.length is 1 and CurrentUserStore.getCourseRole(currentCourses[0].id) is 'student'

  shouldShowEmpty: (currentCourses, pastCourses) ->
    _.isEmpty(currentCourses) and _.isEmpty(pastCourses) # and some way to determine if student?!

  render: ->
    [currentCourses, pastCourses] = CourseListingStore.coursesWithRolesByActive()

    if @shouldShowEmpty(currentCourses, pastCourses)
      <EmptyCourses />
    else if @shouldRedirect(currentCourses, pastCourses)
      <Redirect to={Router.makePathname('dashboard', {courseId: currentCourses[0].id})} />
    else
      <div className='course-listing'>
        <CourseListingCurrent courses={currentCourses}/>
        <CourseListingPast courses={pastCourses}/>
      </div>



module.exports = CourseListing
