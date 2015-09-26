React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

ChapterSection = require '../task-plan/chapter-section'
BindStoreMixin = require '../bind-store-mixin'
{ReferenceBookStore} = require '../../flux/reference-book'
{ReferenceBookPageStore} = require '../../flux/reference-book-page'
SlideOutMenuToggle = require './slide-out-menu-toggle'

module.exports = React.createClass
  displayName: 'ReferenceBookNavBar'
  mixins: [BindStoreMixin]
  bindStore: ReferenceBookPageStore
  propTypes:
    ecosystemId: React.PropTypes.string.isRequired
    toggleTocMenu: React.PropTypes.func.isRequired
    section: React.PropTypes.string.isRequired
    isMenuVisible: React.PropTypes.bool.isRequired
    extraControls: React.PropTypes.element

  renderSectionTitle: ->
    {section, ecosystemId} = @props
    title = ReferenceBookStore.getPageTitle({section, ecosystemId})

    <BS.Nav navbar className="section-title">
      <ChapterSection section={section} />
      {title}
    </BS.Nav>

  render: ->
    <BS.Navbar fixedTop fluid>
      <BS.Nav navbar>
        <BS.NavItem className="menu-toggle" onClick={@props.toggleTocMenu}>
          <SlideOutMenuToggle isVisible={@props.isMenuVisible} />
        </BS.NavItem>
      </BS.Nav>
      <BS.Nav className='full-width-only' navbar>
        <li>
          <i className='ui-brand-logo' />
        </li>
      </BS.Nav>
      {@renderSectionTitle()}
      <BS.Nav className='full-width-only' navbar right>
        <li>
          <i className='ui-rice-logo' />
        </li>
      </BS.Nav>
      <BS.Nav navbar right>
        {@props.extraControls}
      </BS.Nav>
    </BS.Navbar>
