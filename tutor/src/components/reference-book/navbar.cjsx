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

    <ul className="nav navbar-nav section-title">
      <li>
        <ChapterSection section={section} />
      </li>
      <li className="title">
        {title}
      </li>
    </ul>

  wrapControl: (element, i) ->
    <li key={i}>{element}</li>

  render: ->
    <BS.Navbar fixedTop fluid>
      <BS.Nav navbar>
        <BS.NavItem className="menu-toggle" onClick={@props.toggleTocMenu} tabIndex=0
          aria-label={if @props.isMenuVisible then "Close Sections Menu" else "Open Sections Menu"}
        >
          <SlideOutMenuToggle isMenuVisible={@props.isMenuVisible} />
        </BS.NavItem>
      </BS.Nav>
      <BS.Nav className='full-width-only' navbar>
        <li>
          <i className='ui-brand-logo' />
        </li>
      </BS.Nav>
      {@renderSectionTitle()}
      <BS.Nav className='full-width-only' navbar right>
        {React.Children.map(@props.extraControls, @wrapControl)}
        <li>
          <i className='ui-rice-logo' />
        </li>
      </BS.Nav>
    </BS.Navbar>
