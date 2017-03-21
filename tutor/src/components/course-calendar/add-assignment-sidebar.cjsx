React = require 'react'
BS = require 'react-bootstrap'
isEmpty = require 'lodash/isEmpty'

classnames = require 'classnames'
{UiSettings} = require 'shared'

{AddAssignmentLink} = require './task-dnd'

{PastAssignmentsShell} = require './past-assignments'
{ default: TourAnchor } = require '../tours/anchor'

CourseAddMenuMixin = require './add-menu-mixin'
BindStoreMixin = require '../bind-store-mixin'
CalendarHelper = require './helper'
{CourseStore} = require '../../flux/course'
{PastTaskPlansStore} = require '../../flux/past-task-plans'

IS_INTRO_VIEWED = 'viewed-plan-dnd-intro'
USE_SETTINGS = false

IntroPopover = (props) ->
  <BS.Overlay
    show={props.show}
    placement='right'
    container={document.querySelector('.new-assignments')}
  >
    <BS.Popover id='drag-intro'>
      <p>Click to add, or just drag to calendar.</p>
      <BS.Button bsSize='small' onClick={props.onClose}>
        Got it
      </BS.Button>
    </BS.Popover>
  </BS.Overlay>

AddAssignmentSidebar = React.createClass

  mixins: [ CourseAddMenuMixin, BindStoreMixin ]
  bindStore: PastTaskPlansStore

  propTypes:
    courseId: React.PropTypes.string.isRequired
    hasPeriods: React.PropTypes.bool.isRequired
    isOpen: React.PropTypes.bool.isRequired
    cloningPlanId: React.PropTypes.string

  getInitialState: ->
    introViewed = if USE_SETTINGS then UiSettings.get(IS_INTRO_VIEWED) else false
    willShowIntro: CalendarHelper.shouldIntro() and not introViewed

  componentWillReceiveProps: (nextProps) ->
    # kickoff intro if we're opening after being closed
    if @state.willShowIntro and nextProps.isOpen and not @props.isOpen
      @setState(
        pendingIntroTimeout: CalendarHelper.scheduleIntroEvent(@showIntro)
      )

  componentWillUnmount: ->
    CalendarHelper.clearScheduledEvent(@state.pendingIntroTimeout)

  showIntro: ->
    @setState(
      showIntro: true, willShowIntro: false,
      pendingIntroTimeout: CalendarHelper.scheduleIntroEvent(@showPopover)
    )


  showPopover: ->
    @setState(showPopover: true, pendingIntroTimeout: false)

  onPopoverClose: ->
    UiSettings.set(IS_INTRO_VIEWED, true) if USE_SETTINGS
    @setState(showPopover: false, showIntro: false)

  renderMenuLink: (link) ->
    <TourAnchor
      tag="li"
      key={link.type}
      id={"sidebar-add-#{link.type}-assignment"}
    >
      <AddAssignmentLink
        link={link}
        goToBuilder={@goToBuilder}
        onDrag={@onPopoverClose}
      />
    </TourAnchor>

  render: ->
    <div className={classnames('add-assignment-sidebar', {
      'is-open': @props.isOpen
    })}>
      <TourAnchor id="sidebar-add-tasks" className='sidebar-section'>
        <div className="section-label">New</div>

        <ul
          className={classnames('new-assignments',
            'is-intro': @state.showIntro
          )}
          ref='newAssignments'
        >
          {@renderAddActions()}
        </ul>
        <IntroPopover onClose={@onPopoverClose} show={@state.showPopover and @props.isOpen} />
      </TourAnchor>
      <PastAssignmentsShell
        className='sidebar-section'
        courseId={@props.courseId}
        cloningPlanId={@props.cloningPlanId}
      />
    </div>
module.exports = AddAssignmentSidebar
