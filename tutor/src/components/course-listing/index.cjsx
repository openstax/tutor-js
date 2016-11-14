_ = require 'lodash'
React = require 'react'
BS = require 'react-bootstrap'
{Redirect, Link} = require 'react-router'
classnames = require 'classnames'

Router = require '../../helpers/router'

WindowHelpers = require '../../helpers/window'

{CourseListingActions, CourseListingStore} = require '../../flux/course-listing'
{CourseStore} = require '../../flux/course'
{CurrentUserStore} = require '../../flux/current-user'
{RefreshButton} = require 'shared'
EmptyCourses    = require '../course-listing/empty'
CourseData = require '../course-data-mixin'

{Course, CourseTeacher} = require './course'

getReactBaseName = (context) -> _.kebabCase(context.constructor.displayName)

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

wrapCourseItem = (Item, course = {}) ->
  {id} = course
  courseName = id or 'new'

  if id
    courseDataProps = CourseData.getCourseDataProps(id)
    courseSubject = CourseStore.getSubject(id)

  <BS.Col key="course-listing-item-wrapper-#{courseName}" md={3} sm={4} xs={12}>
    <Item
      course={course}
      courseSubject={courseSubject}
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
    {courses, isATeacher} = @props
    baseName = getReactBaseName(@)

    <div className={baseName}>
      <BS.Grid>
        <@Title />
        {<@NoCourses /> if _.isEmpty(courses)}
        <CourseListingBase
          className="#{baseName}-section"
          courses={courses}
          after={<@AddCourses /> if isATeacher}
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
    isATeacher = CourseListingStore.isAnyTeacher()

    if @shouldShowEmpty(currentCourses, pastCourses)
      <EmptyCourses />
    else if @shouldRedirect(currentCourses, pastCourses)
      <Redirect to={Router.makePathname('dashboard', {courseId: currentCourses[0].id})} />
    else
      <div className='course-listing'>
        <CourseListingCurrent courses={currentCourses} isATeacher={isATeacher}/>
        <CourseListingPast courses={pastCourses} />
      </div>



module.exports = CourseListing
