React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

TutorLink = require '../link'
ChapterSection = require '../task-plan/chapter-section'
BindStoreMixin = require '../bind-store-mixin'
{ReferenceBookStore} = require '../../flux/reference-book'
{ReferenceBookPageStore} = require '../../flux/reference-book-page'
SlideOutMenuToggle = require './slide-out-menu-toggle'
{default: AnnotationsSummaryToggle} = require '../annotations/summary-toggle'

module.exports = React.createClass
  displayName: 'ReferenceBookNavBar'
  mixins: [BindStoreMixin]
  bindStore: ReferenceBookPageStore
  propTypes:
    courseId: React.PropTypes.string.isRequired
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

  render: ->
    <nav className="tutor-top-navbar">
      <div className="tutor-nav-controls">
        <div className="left-side-controls">
          <a
            className="menu-toggle"
            onClick={@props.toggleTocMenu} tabIndex=0
            aria-label={if @props.isMenuVisible then "Close Sections Menu" else "Open Sections Menu"}
          >
            <SlideOutMenuToggle isMenuVisible={@props.isMenuVisible} />
          </a>

          <TutorLink to="myCourses" className="brand">
            <i className="ui-brand-logo" />
          </TutorLink>

          {@renderSectionTitle()}

        </div>

        <div className='center-control'>
          <div className='icons'>
            <AnnotationsSummaryToggle
              type="refbook"
              section={@props.section}
              courseId={@props.courseId}
              ecosystemId={@props.ecosystemId}
            />
          </div>
        </div>
        <div className="right-side-controls">
          {@props.extraControls}
        </div>
      </div>
    </nav>
