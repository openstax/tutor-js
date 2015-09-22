React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

LoadableItem = require '../loadable-item'
ReferenceBookPage = require './page'

{Invalid} = require '../index'
{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../flux/reference-book-page'

ReferenceBookPageShell = React.createClass

  propTypes:
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


module.exports = ReferenceBookPageShell
