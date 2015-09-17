React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
_  = require 'underscore'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../flux/reference-book-page'
{CourseActions, CourseStore} = require '../../flux/course'
{Invalid} = require '../index'

LoadableItem = require '../loadable-item'
moment = require 'moment'
ReferenceBook = require './reference-book'
ReferenceBookPage = require './page'

ReferenceBookPageShell = React.createClass
  displayName: 'ReferenceBookPageShell'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    cnxId: React.PropTypes.string.isRequired

  getDefaultState: ->
    previousPageProps: null

  componentWillReceiveProps: (nextProps) ->
    @setState(previousPageProps: @props)

  isAnotherPage: (previousPageProps, currentProps) ->
    previousPageProps? and previousPageProps.cnxId? and not _.isEqual(previousPageProps, currentProps)

  renderLoading: (previousPageProps, currentProps, refreshButton) ->
    if @isAnotherPage(previousPageProps, currentProps)
      loading = <ReferenceBookPage
        {...previousPageProps}
        className='page-loading loadable is-loading'>
        {refreshButton}
      </ReferenceBookPage>
    else
      loading = <div className='loadable is-loading'>Loading... {refreshButton}</div>

    loading

  renderLoaded: ->
    <ReferenceBookPage {...@props}/>

  render: ->
    if @props.cnxId?
      <LoadableItem
        id={@props.cnxId}
        store={ReferenceBookPageStore}
        actions={ReferenceBookPageActions}
        renderLoading={_.partial(@renderLoading, @state?.previousPageProps, @props)}
        renderItem={@renderLoaded}
      />
    else
      <Invalid />


ReferenceBookShell = React.createClass
  displayName: 'ReferenceBookShell'
  contextTypes:
    router: React.PropTypes.func
  getInitialState: ->
    @getIds()

  componentWillMount: ->
    {courseId} = @context.router.getCurrentParams()
    @setIds()

    unless CourseStore.isLoaded(courseId)
      CourseActions.load(courseId)
      CourseStore.once('course.loaded', @setIds.bind(@))

  componentWillReceiveProps: ->
    @setIds()

  getIds: ->
    {courseId} = @context.router.getCurrentParams()
    {ecosystemId} = @context.router.getCurrentQuery()
    ecosystemId ?= CourseStore.get(courseId)?.ecosystem_id
    {courseId, ecosystemId}

  setIds: ->
    @setState(@getIds())

  render: ->
    {courseId, ecosystemId} = @state

    <LoadableItem
      id={ecosystemId}
      store={ReferenceBookStore}
      actions={ReferenceBookActions}
      renderItem={ -> <ReferenceBook courseId={courseId} ecosystemId={ecosystemId}/> }
    />


module.exports = {ReferenceBookShell, ReferenceBookPageShell}
