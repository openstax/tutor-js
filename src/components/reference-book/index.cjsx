React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
_  = require 'underscore'
classnames = require 'classnames'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
{CourseActions, CourseStore} = require '../../flux/course'
ReferenceBookPageShell = require './page-shell'
LoadableItem = require '../loadable-item'
moment = require 'moment'
ReferenceBook = require './reference-book'
CourseDataMixin = require '../course-data-mixin'
TeacherContentToggle = require './teacher-content-toggle'

ReferenceBookShell = React.createClass
  displayName: 'ReferenceBookShell'

  mixins: [CourseDataMixin]

  contextTypes:
    router: React.PropTypes.func
    params: React.PropTypes.object
  getInitialState: ->
    @getIds()

  componentWillMount: ->
    {courseId} = @context.params
    @setIds()

    unless CourseStore.isLoaded(courseId)
      CourseActions.load(courseId)
      CourseStore.once('course.loaded', @setIds)

  componentWillReceiveProps: ->
    @setIds()

  getIds: ->
    {courseId, section} = @context.params
    {ecosystemId} = @context.router.getCurrentQuery()
    ecosystemId ?= CourseStore.get(courseId)?.ecosystem_id
    {courseId, section, ecosystemId}

  setIds: ->
    @setState(@getIds())

  setTeacherContent: (isShowing) ->
    @setState(isShowingTeacherContent: isShowing)

  renderNavbarControls: ->
    return null unless CourseStore.isTeacher(@state.courseId)
    <BS.Nav navbar right>
      <TeacherContentToggle isShowing={@state.isShowingTeacherContent} onChange={@setTeacherContent} />
    </BS.Nav>


  renderBook: ->
    {courseId, ecosystemId} = @state
    if courseId
      sectionPath = "/books/#{courseId}/section/"
    else
      sectionPath = "/books/#{ecosystemId}/section/"

    <ReferenceBook
        navbarControls={@renderNavbarControls()}
        section={@state.section}
        pageNavRouterLinkTarget={sectionPath}
        menuRouterLinkTarget={sectionPath}
        className={classnames('is-teacher': @state.isShowingTeacherContent)}
        dataProps={@getCourseDataProps(courseId) if courseId}
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
