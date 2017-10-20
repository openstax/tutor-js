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
require './highlighter.js'
serializeSelection = require('serialize-selection')

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
    window.document.addEventListener('selectionchange', @handleSelectionChange)
    window.document.addEventListener('keyup', @handleKeyUp)

  componentWillReceiveProps: ->
    @setIds()

  componentWillUnmount: ->
    window.document.removeEventListener('selectionchange', @handleSelectionChange)
    window.document.removeEventListener('keyup', @handleKeyUp)

  handleSelectionChange: ->
    #console.debug("Handling selection change", window.getSelection())

  handleKeyUp: (e) ->
    # For now, because it's easier than putting a widget in
    selection = window.getSelection()
    if (not selection.isCollapsed)
      serialization = serializeSelection.save()
      console.debug("Serialize?", serialization)
      highlighter = new TextHighlighter(document.body)
      highlighter.doHighlight()
      highlights = highlighter.serializeHighlights()
      console.debug("You highlighted", highlights)

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
