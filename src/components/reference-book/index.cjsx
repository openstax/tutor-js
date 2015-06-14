React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../flux/reference-book-page'

LoadableItem = require '../loadable-item'
moment = require 'moment'
ReferenceBook = require './reference-book'
ReferenceBookPage = require './page'
ReferenceBookTOC  = require './page'

ReferenceBookPageShell = React.createClass
  displayName: 'ReferenceBookPageShell'
  mixins: [ Router.State ]

  render: ->
    {cnxId} = @getParams()
    <LoadableItem
      id={cnxId}
      store={ReferenceBookPageStore}
      actions={ReferenceBookPageActions}
      renderItem={ -> <ReferenceBookPage cnxId={cnxId}/> }
    />



ReferenceBookShell = React.createClass
  displayName: 'ReferenceBookShell'
  mixins: [ Router.State ]

  render: ->
    {courseId} = @getParams()
    <LoadableItem
      id={courseId}
      store={ReferenceBookStore}
      actions={ReferenceBookActions}
      renderItem={ -> <ReferenceBook courseId={courseId}/> }
    />


module.exports = {ReferenceBookShell, ReferenceBookPageShell, ReferenceBookTOC}
