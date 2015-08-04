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
  contextTypes:
    router: React.PropTypes.func

  getProps: ->
    params = {courseId, cnxId, section} = @context.router.getCurrentParams()
    return params if courseId? and cnxId? and section?

    if section?
      page = ReferenceBookStore.getChapterSectionPage({courseId, section})
    else
      section = ReferenceBookStore.getFirstSection(courseId)
      page = _.first ReferenceBookStore.getPages(courseId)

    cnxId ?= page.cnx_id

    {cnxId, section, courseId}

  render: ->
    pageProps = @getProps()
    if pageProps.cnxId?
      <LoadableItem
        id={pageProps.cnxId}
        store={ReferenceBookPageStore}
        actions={ReferenceBookPageActions}
        renderItem={ -> <ReferenceBookPage {...pageProps}/> }
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
