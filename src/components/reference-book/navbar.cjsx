React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

ReferenceBookTOC = require './toc'
BindStoreMixin = require '../bind-store-mixin'
{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../flux/reference-book-page'

module.exports = React.createClass
  displayName: 'ReferenceBookNavBar'
  mixins: [Router.State, BindStoreMixin]
  bindStore: ReferenceBookPageStore

  renderSectionTitle: (cnxId) ->
    page = ReferenceBookPageStore.get(cnxId)
    return null unless page
    <span className="section-title">
      <span className="number">Chapter {page.chapter_section.join('.')}</span>
      {page.title}
    </span>

  render: ->
    {cnxId} = @getParams()
    <BS.Navbar toggleNavKey={0} fixedTop fluid>
      <BS.Nav navbar>
        <BS.DropdownButton buttonClassName="fa fa-bars" noCaret>
          <ReferenceBookTOC courseId={@props.courseId} />
        </BS.DropdownButton>
      </BS.Nav>
      <BS.Nav navbar>
        {@renderSectionTitle(cnxId) if cnxId}
      </BS.Nav>
    </BS.Navbar>
