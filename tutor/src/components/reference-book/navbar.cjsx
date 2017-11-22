React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'
cn = require 'classnames'
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

    <div className="section-title">
      <span>
        <ChapterSection section={section} />
      </span>
      <span className="title">
        {title}
      </span>
    </div>

  render: ->
    <nav
      className={cn('tutor-top-navbar', { 'menu-open': @props.isMenuVisible })}
    >
      <div className="left-side-controls">
        <a
          className="menu-toggle"
          onClick={@props.toggleTocMenu} tabIndex=0
          aria-label={if @props.isMenuVisible then "Close Sections Menu" else "Open Sections Menu"}
        >
          <SlideOutMenuToggle isMenuVisible={@props.isMenuVisible} />
        </a>

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

    </nav>
