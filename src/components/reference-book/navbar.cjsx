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
  mixins: [BindStoreMixin]
  bindStore: ReferenceBookPageStore
  propTypes:
    teacherLinkText: React.PropTypes.string
    toggleTocMenu: React.PropTypes.func.isRequired
    showTeacherEdition: React.PropTypes.func
    courseId: React.PropTypes.string.isRequired
    section: React.PropTypes.string.isRequired

  renderSectionTitle: ->
    {section, courseId, ecosystemId} = @props
    title = ReferenceBookStore.getPageTitle({section, ecosystemId})

    <BS.Nav navbar className="section-title">
      <ChapterSection section={section} />
      {title}
    </BS.Nav>


  renderTeacher: ->
    <BS.Nav navbar right>
      <BS.Button className="btn-sm teacher-edition" onClick={@props.showTeacherEdition}>
        {@props.teacherLinkText}
      </BS.Button>
    </BS.Nav>

  render: ->
    <BS.Navbar fixedTop fluid>
      <BS.Nav navbar>
        <BS.NavItem onClick={@props.toggleTocMenu}>
          <i className="menu-toggle fa fa-2x" />
        </BS.NavItem>
      </BS.Nav>
      <BS.Nav className="full-width-only" navbar>
        <li>
          <i className='ui-brand-logo' />
        </li>
      </BS.Nav>
      {@renderSectionTitle()}
      <BS.Nav className="full-width-only" navbar right>
        <li>
          <i className='ui-rice-logo' />
        </li>
      </BS.Nav>
      {@renderTeacher() if @props.showTeacherEdition}

    </BS.Navbar>
