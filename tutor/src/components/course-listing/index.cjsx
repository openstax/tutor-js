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

{Course, CoursePastTeacher} = require './course'

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

wrapCourseItem = (Item, course, courseDataProps) ->
  <BS.Col key="course-listing-item-wrapper-#{course.id}" md={3} sm={4}>
    <Item course={course} courseDataProps={courseDataProps}/>
  </BS.Col>

DEFAULT_COURSE_ITEMS =
  teacher: Course
  student: Course

CourseListingBase = React.createClass
  displayName: 'CourseListingBase'

  getItems: ->
    _.merge({}, DEFAULT_COURSE_ITEMS, @props.Items)

  render: ->
    {courses, className} = @props
    Items = @getItems()

    sectionClasses = classnames('course-listing-section', className)

    <BS.Row className={sectionClasses}>
      {_.map(courses, (course) ->
        Item = Items[CurrentUserStore.getCourseRole(course.id)]
        if Item then wrapCourseItem(Item, course, CourseData.getCourseDataProps(course.id))
      )}
    </BS.Row>

AddCourseArea = ->
  <div className='course-listing-add'><p>Add a course</p></div>

CourseListingCurrent = React.createClass
  displayName: 'CourseListingCurrent'
  NoCourses: ->
    <BS.Row>
      <BS.Col md={12}>
        <p>There are no current courses.</p>
      </BS.Col>
    </BS.Row>

  Title: ->
    baseName = getReactBaseName(@)

    <BS.Row className="#{baseName}-title">
      <BS.Col md={12}>
        <h1>Current Courses</h1>
      </BS.Col>
    </BS.Row>

  AddCourses: ->
    baseName = getReactBaseName(@)

    <BS.Row className="#{baseName}-add">
      {wrapCourseItem(AddCourseArea, {id: 'new'})}
    </BS.Row>

  render: ->
    {courses} = @props
    baseName = getReactBaseName(@)

    <div className={baseName}>
      <BS.Grid>
        <@Title />
        {if _.isEmpty(courses)
          <@NoCourses />
        else
          <CourseListingBase
            className="#{baseName}-section"
            courses={courses}
          />}
        <@AddCourses />
      </BS.Grid>
    </div>

CourseListingPast = React.createClass
  displayName: 'CourseListingPast'
  NoCourses: ->
    null

  Title: ->
    baseName = getReactBaseName(@)

    <BS.Row className="#{baseName}-title">
      <BS.Col md={12}>
        <h1>Past Courses</h1>
      </BS.Col>
    </BS.Row>

  render: ->
    {courses} = @props
    baseName = getReactBaseName(@)

    <div className={baseName}>
      <BS.Grid>
        {if _.isEmpty(courses)
          <@NoCourses />
        else
          [
            <@Title key="#{baseName}-title"/>
            <CourseListingBase
              className="#{baseName}-section"
              courses={courses}
              Items={{teacher: CoursePastTeacher}}
              key="#{baseName}-section"/>
          ]}
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

    if @shouldShowEmpty(currentCourses, pastCourses)
      <EmptyCourses />
    else if @shouldRedirect(currentCourses, pastCourses)
      <Redirect to={Router.makePathname('dashboard', {courseId: currentCourses[0].id})} />
    else
      <div className='course-listing'>
        <CourseListingCurrent courses={currentCourses}/>
        <CourseListingPast courses={currentCourses}/>
      </div>



module.exports = CourseListing
