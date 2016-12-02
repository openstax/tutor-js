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

  shouldRedirect: (past, current) ->
    CurrentUserStore.getCourseRole(current[0].id) is 'student' and
      current.length is 1 and
      past.length is 0

  shouldShowEmpty: (past, current) ->
    _.isEmpty(past) and _.isEmpty(current) # and some way to determine if student?!

  render: ->
    [past, current] = CourseListingStore.coursesOrderedByStatus()

    if @shouldShowEmpty(past, current)
      <EmptyCourses />
    else if @shouldRedirect(past, current)
      <Redirect to={Router.makePathname('dashboard', {courseId: current[0].id})} />
    else
      <div className='course-listing'>
        <CourseListingCurrent courses={current}/>
        <CourseListingPast courses={past}/>
      </div>



module.exports = CourseListing
