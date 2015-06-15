React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
_  = require 'underscore'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../flux/reference-book-page'

LoadableItem = require '../loadable-item'
moment = require 'moment'
ReferenceBook = require './reference-book'
ReferenceBookPage = require './page'

ReferenceBookFirstPage  = React.createClass
  displayName: 'ReferenceBookPageFirstPage'
  mixins: [ Router.State ]
  render: ->
    {courseId} = @getParams()
    page = _.first ReferenceBookStore.getPages(courseId)
    # FIXME - BE route issue
    cnxId = _.first page.cnx_id.split('@')
    <LoadableItem
      id={cnxId}
      store={ReferenceBookPageStore}
      actions={ReferenceBookPageActions}
      renderItem={ -> <ReferenceBookPage courseId={courseId} cnxId={cnxId}/> }
    />



ReferenceBookPageShell = React.createClass
  displayName: 'ReferenceBookPageShell'
  mixins: [ Router.State ]

  render: ->
    {courseId, cnxId} = @getParams()
    <LoadableItem
      id={cnxId}
      store={ReferenceBookPageStore}
      actions={ReferenceBookPageActions}
      renderItem={ -> <ReferenceBookPage courseId=courseId cnxId={cnxId}/> }
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


module.exports = {ReferenceBookShell, ReferenceBookPageShell, ReferenceBookFirstPage}
