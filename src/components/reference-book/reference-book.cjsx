React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
_  = require 'underscore'

BindStoreMixin = require '../bind-store-mixin'
NavBar = require './navbar'
Menu = require './slide-out-menu'

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

  getInitialState: ->
    {cnxId} = @context.router.getCurrentParams()
    # Pop open the menu unless the page was explicitly navigated to
    {isMenuVisible: not cnxId}

  showTeacherEdition: ->
    @setState(showTeacherEdition: not @state.showTeacherEdition)

  onMenuClick: ->
    @toggleMenuState() unless window.innerWidth > 1350

  toggleMenuState: ->
    @setState(isMenuVisible: not @state.isMenuVisible)

  render: ->
    {courseId} = @context.router.getCurrentParams()
    course = CourseStore.get(courseId)
    classnames = ["reference-book"]
    classnames.push('menu-open') if @state.isMenuVisible
    if course and _.findWhere(course.roles, type: 'teacher')
      showTeacher = @showTeacherEdition
      teacherLinkText = if @state.showTeacherEdition
        classnames.push('is-teacher')
        "Hide Teacher Edition"
      else
        "Show Teacher Edition"

    <div className={classnames.join(' ')}>
      <NavBar
        toggleTocMenu={@toggleMenuState}
        teacherLinkText={teacherLinkText}
        showTeacherEdition={showTeacher}
        courseId={courseId}/>
      <div className="content">
        <Menu onMenuSelection={@onMenuClick} />
        <Router.RouteHandler courseId={courseId} />
      </div>
    </div>
