React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'
classnames = require 'classnames'
Router = require '../../helpers/router'
{default: Courses} = require '../../models/courses-map'
{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
CourseData = require '../../helpers/course-data'

ReferenceBookPageShell = require './page-shell'
LoadableItem = require '../loadable-item'

ReferenceBook = require './reference-book'
TeacherContentToggle = require './teacher-content-toggle'

ReferenceBookShell = React.createClass
  displayName: 'ReferenceBookShell'

  getInitialState: ->
    @getIds()

  componentWillMount: ->
    {courseId} = Router.currentParams()
    @setIds()
    course = Courses.get(courseId) or Courses.addNew({ id: courseId })
    unless course.api.hasBeenFetched
      course.fetch().then(@setIds)

  componentWillReceiveProps: ->
    @setIds()

  getIds: ->
    {courseId, section} = Router.currentParams()
    {ecosystemId} = Router.currentQuery()
    ecosystemId ?= Courses.get(courseId)?.ecosystem_id
    {courseId, section, ecosystemId}

  setIds: ->
    @setState(@getIds())

  setTeacherContent: (isShowing) ->
    @setState(isShowingTeacherContent: isShowing)

  renderNavbarControls: ->
    return null unless Courses.get(@state.courseId).isTeacher

    <span key='teacher-content'>
      <TeacherContentToggle isShowing={@state.isShowingTeacherContent} onChange={@setTeacherContent} />
    </span>

  renderBook: ->
    {courseId, ecosystemId} = @state

    <ReferenceBook
        navbarControls={@renderNavbarControls()}
        section={@state.section}
        pageNavRouterLinkTarget='viewReferenceBookSection'
        menuRouterLinkTarget='viewReferenceBookSection'
        className={classnames('is-teacher': @state.isShowingTeacherContent)}
        dataProps={CourseData.getCourseDataProps(courseId) if courseId}
        courseId={courseId}
        ecosystemId={ecosystemId}
    />

  render: ->
    {courseId, ecosystemId} = @state
    <LoadableItem
      id={ecosystemId or Courses.get(courseId).ecosystem_id}
      store={ReferenceBookStore}
      actions={ReferenceBookActions}
      renderItem={@renderBook} />

module.exports = {ReferenceBookShell, ReferenceBookPageShell}
