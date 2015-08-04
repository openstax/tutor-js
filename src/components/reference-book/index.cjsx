React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
_  = require 'underscore'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../flux/reference-book-page'
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
      if previousPageProps? and not _.isEqual(previousPageProps, currentProps)
        loading = <div className='page-loading loadable is-loading'>
          {refreshButton}
          <ReferenceBookPage {...previousPageProps}/>
        </div>
      else
        loading = <div className='loadable is-loading'>Loading... {refreshButton}</div>

      loading

  render: ->
    if @props.cnxId?
      <LoadableItem
        id={@props.cnxId}
        store={ReferenceBookPageStore}
        actions={ReferenceBookPageActions}
        renderLoading={@renderLoading(@state?.previousPageProps, @props)}
        renderItem={ => <ReferenceBookPage {...@props}/> }
      />
    else
      <Invalid />


ReferenceBookShell = React.createClass
  displayName: 'ReferenceBookShell'
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <LoadableItem
      id={courseId}
      store={ReferenceBookStore}
      actions={ReferenceBookActions}
      renderItem={ -> <ReferenceBook courseId={courseId}/> }
    />


module.exports = {ReferenceBookShell, ReferenceBookPageShell}
