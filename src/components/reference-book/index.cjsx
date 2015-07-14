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

ReferenceBookFirstPage  = React.createClass
  displayName: 'ReferenceBookPageFirstPage'
  mixins: [ Router.State ]
  render: ->
    {courseId} = @getParams()
    page = _.first ReferenceBookStore.getPages(courseId)
    <LoadableItem
      id={page.cnx_id}
      store={ReferenceBookPageStore}
      actions={ReferenceBookPageActions}
      renderItem={ -> <ReferenceBookPage courseId={courseId} cnxId={page.cnx_id}/> }
    />



ReferenceBookPageShell = React.createClass
  displayName: 'ReferenceBookPageShell'
  mixins: [ Router.State ]

  render: ->
    {courseId, cnxId, section} = @getParams()
    if section and not cnxId
      page = ReferenceBookStore.getChapterSectionPage({courseId, section})
      cnxId = page?.cnx_id
    if cnxId
      <LoadableItem
        id={cnxId}
        store={ReferenceBookPageStore}
        actions={ReferenceBookPageActions}
        renderItem={ -> <ReferenceBookPage courseId=courseId cnxId={cnxId}/> }
      />
    else
      <Invalid />


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
