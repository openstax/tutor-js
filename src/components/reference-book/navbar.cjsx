React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

ReferenceBookTOC = require './toc'
BindStoreMixin = require '../bind-store-mixin'
{ReferenceBookStore} = require '../../flux/reference-book'
{ReferenceBookPageStore} = require '../../flux/reference-book-page'

module.exports = React.createClass
  displayName: 'ReferenceBookNavBar'
  mixins: [Router.State, BindStoreMixin]
  bindStore: ReferenceBookPageStore
  propTypes:
    teacherLinkText: React.PropTypes.string
    showTeacherEdition: React.PropTypes.func

  componentDidMount: ->
    {cnxId} = @getParams()
    # Pop open the menu unless the page was explicitly navigated to
    @refs.tocmenu.setDropdownState(true) unless cnxId

  renderSectionTitle: ->
    page = ReferenceBookStore.getPageInfo(@getParams())
    <BS.Nav navbar className="section-title">
      <span className="section-number">Chapter {page.chapter_section.join('.')}</span>
      {page.title}
    </BS.Nav>

  onMenuClick: ->
    # close the dropdown menu when a link is clicked
    @refs.tocmenu.setDropdownState(false)

  renderTeacher: ->
    <BS.Nav navbar right>
      <a className="teacher-edition" onClick={@props.showTeacherEdition}>
        {@props.teacherLinkText}
      </a>
    </BS.Nav>


  render: ->
    {cnxId} = @getParams()
    <BS.Navbar toggleNavKey={0} fixedTop fluid>
      <BS.Nav navbar>
        <BS.DropdownButton ref="tocmenu" buttonClassName="fa fa-bars" noCaret>
          <ReferenceBookTOC courseId={@props.courseId} onClick={@onMenuClick} />
        </BS.DropdownButton>
      </BS.Nav>
      {@renderSectionTitle() if cnxId}
      {@renderTeacher() if @props.showTeacherEdition}
    </BS.Navbar>
