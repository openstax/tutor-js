_ = require 'lodash'
React = require 'react'
BS = require 'react-bootstrap'
{Link} = require 'react-router'
classnames = require 'classnames'

Router = require '../../helpers/router'

{CourseStore} = require '../../flux/course'
{CurrentUserStore} = require '../../flux/current-user'

CourseData = require '../course-data-mixin'

{Course, CourseTeacher} = require './course'

getReactBaseName = (context) -> _.kebabCase(context.constructor.displayName)

wrapCourseItem = (Item, course = {}) ->
  {id} = course
  courseName = id or 'new'

  if id
    courseDataProps = CourseData.getCourseDataProps(id)
    courseSubject = CourseStore.getSubject(id)
    courseIsTeacher = CourseStore.isTeacher(id)

  <BS.Col key="course-listing-item-wrapper-#{courseName}" md={3} sm={4} xs={12}>
    <Item
      course={course}
      courseSubject={courseSubject}
      courseIsTeacher={courseIsTeacher}
      courseDataProps={courseDataProps}/>
  </BS.Col>

DEFAULT_COURSE_ITEMS =
  teacher: CourseTeacher
  student: Course

CourseListingBase = React.createClass
  displayName: 'CourseListingBase'

  getItems: ->
    _.merge({}, DEFAULT_COURSE_ITEMS, @props.Items)

  render: ->
    {courses, className, before, after} = @props
    Items = @getItems()

    sectionClasses = classnames('course-listing-section', className)

    <BS.Row className={sectionClasses}>
      {before}
      {_.map(courses, (course) ->
        Item = Items[CurrentUserStore.getCourseRole(course.id)]
        if Item then wrapCourseItem(Item, course)
      )}
      {after}
    </BS.Row>

AddCourseArea = ->
  <Link
    to={Router.makePathname('createNewCourse')}
    className='course-listing-add-zone'
  >
    <span>Add a course</span>
  </Link>

CourseListingCurrent = React.createClass
  displayName: 'CourseListingCurrent'
  NoCourses: ->
    <BS.Row className='course-listing-none'>
      <BS.Col md={12}>
        <p>There are no current courses.</p>
      </BS.Col>
    </BS.Row>

  Title: ->
    baseName = getReactBaseName(@)

    <BS.Row className='course-listing-title'>
      <BS.Col md={12}>
        <h1>Current Courses</h1>
      </BS.Col>
    </BS.Row>

  AddCourses: ->
    wrapCourseItem(AddCourseArea)

  render: ->
    {courses} = @props
    baseName = getReactBaseName(@)

    <div className={baseName}>
      <BS.Grid>
        <@Title />
        {<@NoCourses /> if _.isEmpty(courses)}
        <CourseListingBase
          className="#{baseName}-section"
          courses={courses}
          after={<@AddCourses /> if CurrentUserStore.isTeacher()}
        />
      </BS.Grid>
    </div>

CourseListingPast = React.createClass
  displayName: 'CourseListingPast'
  NoCourses: ->
    null

  Title: ->
    baseName = getReactBaseName(@)

    <BS.Row className='course-listing-title'>
      <BS.Col md={12}>
        <h2>Past Courses</h2>
      </BS.Col>
    </BS.Row>

  render: ->
    {courses} = @props
    baseName = getReactBaseName(@)

    if _.isEmpty(courses)
      <@NoCourses />
    else
      <div className={baseName}>
        <BS.Grid>
          <@Title />
          <CourseListingBase
            className="#{baseName}-section"
            courses={courses}
          />
        </BS.Grid>
      </div>

module.exports = {CourseListingPast, CourseListingCurrent}
