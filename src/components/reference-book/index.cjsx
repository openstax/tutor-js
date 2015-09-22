React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
_  = require 'underscore'

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
  getInitialState: ->
    @getIds()

  componentWillMount: ->
    {courseId} = @context.router.getCurrentParams()
    @setIds()

    unless CourseStore.isLoaded(courseId)
      CourseActions.load(courseId)
      CourseStore.once('course.loaded', @setIds)

  componentWillReceiveProps: ->
    @setIds()

  getIds: ->
    {courseId, section} = @context.router.getCurrentParams()
    {ecosystemId} = @context.router.getCurrentQuery()
    ecosystemId ?= CourseStore.get(courseId)?.ecosystem_id
    {courseId, section, ecosystemId}

  setIds: ->
    @setState(@getIds())

  setTeacherContent: (isShowing) ->
    @setState(isShowingTeacherContent: isShowing)

  renderNavbarControls: ->
    return null unless CourseStore.isTeacher(@state.courseId)
    <TeacherContentToggle onChange={@setTeacherContent} />

  renderBook: ->
    classnames = []
    classnames.push('is-teacher') if @state.isShowingTeacherContent
    {courseId, ecosystemId} = @state

    <ReferenceBook
        navbarControls={@renderNavbarControls()}
        section={@state.section}
        className={classnames.join(' ')}
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
