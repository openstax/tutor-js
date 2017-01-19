React = require 'react'
_  = require 'underscore'

LoadableItem = require '../loadable-item'
ReferenceBookPage = require './page'

InvalidPage = require '../invalid-page'
{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../flux/reference-book-page'

ReferenceBookPageShell = React.createClass
  displayName: 'ReferenceBookPage'
  propTypes:
    cnxId: React.PropTypes.string.isRequired

  isAnotherPage: (currentProps) ->
    @lastLoadedProps? and @lastLoadedProps.cnxId? and @lastLoadedProps.cnxId isnt currentProps.cnxId

  renderLoading: (currentProps, refreshButton) ->
    if @isAnotherPage(currentProps)
      loading = <ReferenceBookPage
        {...@lastLoadedProps}
        className='page-loading loadable is-loading'>
        {refreshButton}
      </ReferenceBookPage>
    else
      loading = <div className='loadable is-loading'>Loading... {refreshButton}</div>

    loading

  renderLoaded: ->
    # Keep track of the last page that is actually loaded because we'll render it under the loading overlay
    @lastLoadedProps = @props
    <ReferenceBookPage {...@props}/>

  render: ->
    if @props.cnxId?
      <LoadableItem
        id={@props.cnxId}
        store={ReferenceBookPageStore}
        actions={ReferenceBookPageActions}
        renderLoading={_.partial(@renderLoading, @props)}
        renderItem={@renderLoaded}
      />
    else
      <InvalidPage />


module.exports = ReferenceBookPageShell
