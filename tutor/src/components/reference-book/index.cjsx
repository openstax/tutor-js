React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'
classnames = require 'classnames'
Router = require '../../helpers/router'
{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
{CourseActions, CourseStore} = require '../../flux/course'
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

    unless CourseStore.isLoaded(courseId)
      CourseActions.load(courseId)
      CourseStore.once('course.loaded', @setIds)

  componentDidMount: ->



  componentWillReceiveProps: ->
    @setIds()

  getIds: ->
    {courseId, section} = Router.currentParams()
    {ecosystemId} = Router.currentQuery()
    ecosystemId ?= CourseStore.get(courseId)?.ecosystem_id
    {courseId, section, ecosystemId}

  setIds: ->
    @setState(@getIds())

  setTeacherContent: (isShowing) ->
    @setState(isShowingTeacherContent: isShowing)

  renderNavbarControls: ->
    return null unless CourseStore.isTeacher(@state.courseId)

    <BS.NavItem key='teacher-content'>
      <TeacherContentToggle isShowing={@state.isShowingTeacherContent} onChange={@setTeacherContent} />
    </BS.NavItem>

  renderBook: ->
    {courseId, ecosystemId} = @state

    <ReferenceBook
        navbarControls={@renderNavbarControls()}
        section={@state.section}
        pageNavRouterLinkTarget='viewReferenceBookSection'
        menuRouterLinkTarget='viewReferenceBookSection'
        className={classnames('is-teacher': @state.isShowingTeacherContent)}
        dataProps={CourseData.getCourseDataProps(courseId) if courseId}
        ecosystemId={ecosystemId}
    />

  render: ->
    {courseId, ecosystemId} = @state
    <LoadableItem
      id={ecosystemId or CourseStore.get(courseId).ecosystem_id}
      store={ReferenceBookStore}
      actions={ReferenceBookActions}
      renderItem={@renderBook} />


module.exports = {ReferenceBookShell, ReferenceBookPageShell}
