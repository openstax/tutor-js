React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

ChapterSection = require '../task-plan/chapter-section'
ReferenceBookTOC = require './toc'
BindStoreMixin = require '../bind-store-mixin'
{ReferenceBookStore} = require '../../flux/reference-book'
{ReferenceBookPageStore} = require '../../flux/reference-book-page'

module.exports = React.createClass
  displayName: 'ReferenceBookNavBar'
  mixins: [BindStoreMixin]
  contextTypes:
    router: React.PropTypes.func
  bindStore: ReferenceBookPageStore
  propTypes:
    teacherLinkText: React.PropTypes.string
    showTeacherEdition: React.PropTypes.func

  componentDidMount: ->
    {cnxId} = @context.router.getCurrentParams()
    # Pop open the menu unless the page was explicitly navigated to
    @refs.tocmenu.setDropdownState(true) unless cnxId

  renderSectionTitle: ->
    {cnxId, section} = @context.router.getCurrentParams()
    if cnxId
      page = ReferenceBookStore.getPageInfo(@context.router.getCurrentParams())
      section = page?.chapter_section
    else if section
      page = ReferenceBookStore.getChapterSectionPage(@context.router.getCurrentParams())
    <BS.Nav navbar className="section-title">
      <ChapterSection section={section} />
      {page?.title}
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
    {cnxId} = @context.router.getCurrentParams()
    <BS.Navbar toggleNavKey={0} fixedTop fluid>
      <BS.Nav navbar>
        <BS.DropdownButton ref="tocmenu" buttonClassName="fa fa-bars" noCaret>
          <ReferenceBookTOC courseId={@props.courseId} onClick={@onMenuClick} />
        </BS.DropdownButton>
      </BS.Nav>
      {@renderSectionTitle()}
      {@renderTeacher() if @props.showTeacherEdition}
    </BS.Navbar>
