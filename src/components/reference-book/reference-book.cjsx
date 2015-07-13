React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
_  = require 'underscore'

BindStoreMixin = require '../bind-store-mixin'
NavBar = require './navbar'

{CourseListingStore} = require '../../flux/course-listing'
{CourseStore} = require '../../flux/course'

module.exports = React.createClass
  displayName: 'ReferenceBook'
  contextTypes:
    router: React.PropTypes.func
  mixins: [BindStoreMixin]
  bindStore: CourseListingStore
  bindEvent: 'loaded'

  componentWillMount: ->
    CourseListingStore.ensureLoaded()

  showTeacherEdition: ->
    @setState(showTeacherEdition: not @state.showTeacherEdition)

  render: ->
    {courseId} = @context.router.getCurrentParams()
    course = CourseStore.get(courseId)
    classnames = ["reference-book"]
    if course and _.findWhere(course.roles, type: 'teacher')
      showTeacher = @showTeacherEdition
      teacherLinkText = if @state.showTeacherEdition
        classnames.push('is-teacher')
        "Hide Teacher Edition"
      else
        "Show Teacher Edition"

    <div className={classnames.join(' ')}>
      <NavBar
        teacherLinkText={teacherLinkText}
        showTeacherEdition={showTeacher}
        courseId={courseId}/>
      <div className="content">
        <Router.RouteHandler courseId={courseId} />
      </div>
    </div>
