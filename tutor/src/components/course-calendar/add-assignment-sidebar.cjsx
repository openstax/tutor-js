React = require 'react'
BS = require 'react-bootstrap'
isEmpty = require 'lodash/isEmpty'

classnames = require 'classnames'

{AddAssignmentLink} = require './task-dnd'

PastAssignments = require './past-assignments'

CourseAddMenuMixin = require './add-menu-mixin'
BindStoreMixin = require '../bind-store-mixin'

{CourseStore} = require '../../flux/course'
{PastTaskPlansStore} = require '../../flux/past-task-plans'

AddAssignmentSidebar = React.createClass

  mixins: [ CourseAddMenuMixin, BindStoreMixin ]
  bindStore: PastTaskPlansStore

  propTypes:
    courseId: React.PropTypes.string.isRequired
    hasPeriods: React.PropTypes.bool.isRequired
    isOpen: React.PropTypes.bool.isRequired

  getInitialState: ->
    showIntro: @props.isOpen
    needsIntro: false

  bindUpdate: ->
    @setState(needsIntro: PastTaskPlansStore.hasPlans(@props.courseId))

  shouldShowIntro: ->
    @props.isOpen and @state.needsIntro and @state.showIntro

  renderMenuLink: (link) ->
    <AddAssignmentLink
      key={link.type}
      link={link}
      goToBuilder={@goToBuilder}
      onDrag={@closeHelp}
    />

  closeHelp: ->
    @setState(showIntro: false)

  Intro: ->
    <BS.Overlay
      show={@state.showIntro}
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
      <PastAssignments className='sidebar-section' courseId={@props.courseId} />
    </div>
module.exports = AddAssignmentSidebar
