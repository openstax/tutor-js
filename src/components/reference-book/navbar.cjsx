React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
_  = require 'underscore'

ChapterSection = require '../task-plan/chapter-section'
BindStoreMixin = require '../bind-store-mixin'
{ReferenceBookStore} = require '../../flux/reference-book'
{ReferenceBookPageStore} = require '../../flux/reference-book-page'

module.exports = React.createClass
  displayName: 'ReferenceBookNavBar'
  mixins: [Router.State, BindStoreMixin]
  bindStore: ReferenceBookPageStore
  propTypes:
    teacherLinkText: React.PropTypes.string
    toggleTocMenu: React.PropTypes.func.isRequired
    showTeacherEdition: React.PropTypes.func

  renderSectionTitle: ->
    {cnxId, section} = @getParams()
    if cnxId
      page = ReferenceBookStore.getPageInfo(@getParams())
      section = page?.chapter_section
    else if section
      page = ReferenceBookStore.getChapterSectionPage(@getParams())
    section = section.split('.') if section and _.isString(section)
    <BS.Nav navbar className="section-title">
      <ChapterSection section={section} />
      {page?.title}
    </BS.Nav>


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
        <BS.NavItem onClick={@props.toggleTocMenu}>
          <i className="menu-toggle fa fa-2x" />
        </BS.NavItem>
      </BS.Nav>
      {@renderSectionTitle()}
      {@renderTeacher() if @props.showTeacherEdition}
    </BS.Navbar>
