_ = require 'lodash'
React = require 'react'
BS = require 'react-bootstrap'
{Link} = require 'react-router'
classnames = require 'classnames'

Router = require '../../helpers/router'

{CourseStore} = require '../../flux/course'
{CurrentUserStore} = require '../../flux/current-user'
{getReactBaseName} = require '../../helpers/react'

CourseData = require '../course-data-mixin'
IconAdd = require  '../icons/add'

{Course, CourseTeacher, CoursePropType} = require './course'


wrapCourseItem = (Item, course = {}) ->
  {id} = course
  courseName = id or 'new'

  if id
    courseDataProps = CourseData.getCourseDataProps(id)
    courseSubject = CourseStore.getSubject(id)
    courseIsTeacher = CourseStore.isTeacher(id)

  <BS.Col key="course-listing-item-wrapper-#{courseName}" md={3} sm={6} xs={12}>
    <Item
      course={course}
      courseSubject={courseSubject}
      courseIsTeacher={courseIsTeacher}
      courseDataProps={courseDataProps}/>
  </BS.Col>

AddCourseArea = ->
  <Link
    to={Router.makePathname('createNewCourse')}
    className='course-listing-add-zone'
  >
    <div>
      <IconAdd/>
      Add a course
    </div>
  </Link>

CourseListingNone = ->
  <BS.Row className='course-listing-none'>
    <BS.Col md={12}>
      <p>There are no current courses.</p>
    </BS.Col>
  </BS.Row>

CourseListingAdd = ->
  wrapCourseItem(AddCourseArea)

DEFAULT_COURSE_ITEMS =
  teacher: CourseTeacher
  student: Course

CourseListingBase = React.createClass
  displayName: 'CourseListingBase'
  propTypes:
    courses:    React.PropTypes.arrayOf(CoursePropType.isRequired).isRequired
    items:      React.PropTypes.objectOf(React.PropTypes.element)
    className:  React.PropTypes.string
    before:     React.PropTypes.element
    after:      React.PropTypes.element

  getItems: ->
    _.merge({}, DEFAULT_COURSE_ITEMS, @props.items)

  render: ->
    {courses, className, before, after} = @props
    items = @getItems()

    sectionClasses = classnames('course-listing-section', className)

    <BS.Row className={sectionClasses}>
      {before}
      {_.map(courses, (course) ->
        Item = items[CurrentUserStore.getCourseRole(course.id)]
        if Item then wrapCourseItem(Item, course)
      )}
      {after}
    </BS.Row>

CourseListingTitle = React.createClass
  displayName: 'CourseListingTitle'
  propTypes:
    title: React.PropTypes.string.isRequired
    main: React.PropTypes.bool
  getDefaultProps: ->
    main: false
  render: ->
    {main, title} = @props

    heading = if main
        <h1>{title}</h1>
      else
        <h1>{title}</h1>

    <BS.Row className='course-listing-title'>
      <BS.Col md={12}>
        {heading}
      </BS.Col>
    </BS.Row>

CourseListingCurrent = React.createClass
  displayName: 'CourseListingCurrent'
  propTypes:
    courses:  React.PropTypes.arrayOf(CoursePropType.isRequired).isRequired
  render: ->
    {courses} = @props
    baseName = getReactBaseName(@)

    <div className={baseName}>
      <BS.Grid>
        <CourseListingTitle title='Current Courses' main={true}/>
        {<CourseListingNone /> if _.isEmpty(courses)}
        <CourseListingBase
          className="#{baseName}-section"
          courses={courses}
          after={<CourseListingAdd /> if CurrentUserStore.isTeacher()}
        />
      </BS.Grid>
    </div>

CourseListingBasic = React.createClass
  displayName: 'CourseListingBasic'
  propTypes:
    title:    React.PropTypes.string.isRequired
    baseName: React.PropTypes.string.isRequired
    courses:  React.PropTypes.arrayOf(CoursePropType.isRequired).isRequired
  render: ->
    {courses, baseName, title} = @props

    if _.isEmpty(courses)
      null
    else
      <div className={baseName}>
        <BS.Grid>
          <CourseListingTitle title={title} />
          <CourseListingBase
            className="#{baseName}-section"
            courses={courses}
          />
        </BS.Grid>
      </div>

CourseListingPast = React.createClass
  displayName: 'CourseListingPast'
  propTypes:
    courses:  React.PropTypes.arrayOf(CoursePropType.isRequired).isRequired
  render: ->
    baseName = getReactBaseName(@)
    <CourseListingBasic
      {...@props}
      baseName={baseName}
      title='Past Courses'/>

CourseListingFuture = React.createClass
  displayName: 'CourseListingFuture'
  propTypes:
    courses:  React.PropTypes.arrayOf(CoursePropType.isRequired).isRequired
  render: ->
    baseName = getReactBaseName(@)
    <CourseListingBasic
      {...@props}
      baseName={baseName}
      title='Future Courses'/>

module.exports = {CourseListingPast, CourseListingCurrent, CourseListingFuture}
