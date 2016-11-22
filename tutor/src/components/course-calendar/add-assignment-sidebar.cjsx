React = require 'react'
BS = require 'react-bootstrap'
isEmpty = require 'lodash/isEmpty'

classnames = require 'classnames'
{UiSettings} = require 'shared'

{AddAssignmentLink} = require './task-dnd'

PastAssignments = require './past-assignments'

CourseAddMenuMixin = require './add-menu-mixin'
BindStoreMixin = require '../bind-store-mixin'

{CourseStore} = require '../../flux/course'
{PastTaskPlansStore} = require '../../flux/past-task-plans'

IS_INTRO_VIEWED = 'viewed-plan-dnd-intro'
USE_SETTINGS = false

AddAssignmentSidebar = React.createClass

  mixins: [ CourseAddMenuMixin, BindStoreMixin ]
  bindStore: PastTaskPlansStore

  propTypes:
    courseId: React.PropTypes.string.isRequired
    hasPeriods: React.PropTypes.bool.isRequired
    isOpen: React.PropTypes.bool.isRequired
    shouldIntro: React.PropTypes.bool.isRequired
    cloningPlanId: React.PropTypes.string

  getInitialState: ->
    hasShownIntro: false
    canIntro: false

  bindUpdate: ->
    # show intro only after Past Task Plans have been loaded
    @setState(canIntro: true)

  shouldShowIntro: ->
    shouldIntro = if USE_SETTINGS then not UiSettings.get(IS_INTRO_VIEWED) else true

    @props.shouldIntro and
      @props.isOpen and
      not @state.hasShownIntro and
      @state.canIntro and
      shouldIntro

  renderMenuLink: (link) ->
    <AddAssignmentLink
      key={link.type}
      link={link}
      goToBuilder={@goToBuilder}
      onDrag={@closeHelp}
    />

  closeHelp: ->
    UiSettings.set(IS_INTRO_VIEWED, true) if USE_SETTINGS
    @setState(hasShownIntro: true)

  Intro: ->
    <BS.Overlay
      show={true}
      placement='right'
      container={document.querySelector('.new-assignments .new-task')}
    >
      <BS.Popover id='drag-intro'>
        <p>Click to add, or just drag to calendar.</p>
        <BS.Button bsSize='small' onClick={@closeHelp}>
          Got it
        </BS.Button>
      </BS.Popover>
    </BS.Overlay>

  render: ->
    <div className={classnames('add-assignment-sidebar', {
      'is-open': @props.isOpen
    })}>
      <div className='sidebar-section'>
        <div className="section-label">New</div>
        <ul
          className={classnames('new-assignments',
            'is-intro': @shouldShowIntro()
          )}
          ref='newAssignments'
        >
          {@renderAddActions()}
        </ul>
        {<@Intro/> if @shouldShowIntro()}
      </div>
      <PastAssignments
        className='sidebar-section'
        courseId={@props.courseId}
        cloningPlanId={@props.cloningPlanId}
      />
    </div>
module.exports = AddAssignmentSidebar
