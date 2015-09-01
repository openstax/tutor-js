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

  componentWillReceiveProps: ->
    @setState(previousPageProps: @props)

  renderLoading: (previousPageProps, currentProps) ->
    (refreshButton) ->
      if previousPageProps? and previousPageProps.cnxId? and not _.isEqual(previousPageProps, currentProps)
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
        renderLoading={@renderLoading(@state?.previousPageProps, @props)}
        renderItem={@renderLoaded}
      />
    else
      <Invalid />


ReferenceBookShell = React.createClass
  displayName: 'ReferenceBookShell'
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    {ecosystemId} = @context.router.getCurrentQuery()
    ecosystemId ?= CourseStore.get(courseId)?.ecosystem_id

    <LoadableItem
      id={ecosystemId}
      store={ReferenceBookStore}
      actions={ReferenceBookActions}
      renderItem={ -> <ReferenceBook courseId={courseId} ecosystemId={ecosystemId}/> }
    />


module.exports = {ReferenceBookShell, ReferenceBookPageShell}
