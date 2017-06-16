React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

ScrollSpy   = require '../../scroll-spy'
Sectionizer = require '../../exercises/sectionizer'
Icon        = require '../../icon'

{ default: TourAnchor } = require '../../tours/anchor'
{ default: SelectionsTooltip } = require './selections-tooltip'

{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'

ExerciseControls = React.createClass

  propTypes:
    planId:              React.PropTypes.string.isRequired
    canAdd:              React.PropTypes.bool
    canEdit:             React.PropTypes.bool
    canReview:           React.PropTypes.bool
    addClicked:          React.PropTypes.func
    reviewClicked:       React.PropTypes.func
    sectionizerProps:    React.PropTypes.object
    hideDisplayControls: React.PropTypes.bool

  addTutorSelection: ->
    TaskPlanActions.updateTutorSelection(@props.planId, 1)

  removeTutorSelection: ->
    TaskPlanActions.updateTutorSelection(@props.planId, -1)

  renderDisplayControls: ->
    if @props.hideDisplayControls
      <div className="controls" />
    else
      <div className="controls">
        <ScrollSpy dataSelector='data-section' >
          <Sectionizer
            ref="sectionizer"
            {...@props.sectionizerProps}
            nonAvailableWidth={1000}
            onScreenElements={[]}
          />
        </ScrollSpy>

      </div>


  renderExplanation: ->
    return null if @props.canAdd
    <div className="tutor-added-later">
      <span>
        Tutor selections are added later to support spaced practice and personalized learning.
      </span>
    </div>

  renderActionButtons: ->
    if @props.canReview and TaskPlanStore.exerciseCount(@props.planId)
      [
        <BS.Button
          key='next'
          bsStyle="primary"
          className="-review-exercises"
          onClick={@props.reviewClicked}>Next</BS.Button>
        <BS.Button
          key='cancel'
          bsStyle="default"
          className="-cancel-add"
          onClick={@props.onCancel}>Cancel</BS.Button>
      ]
    else if @props.canAdd
      <BS.Button bsStyle="default"
        className="-add-exercises"
        onClick={@props.addClicked}>+ Add More Sections</BS.Button>
    else
      null

  canChangeTutorQty: ->
    @props.canEdit or @props.canAdd

  renderIncreaseButton: ->
    if @canChangeTutorQty() and TaskPlanStore.canIncreaseTutorExercises(@props.planId)
      <BS.Button onClick={@addTutorSelection} className="btn-xs hover-circle">
        <Icon type='chevron-up' />
      </BS.Button>
    else
      <span className="circle-btn-placeholder"></span>

  renderDecreaseButton: ->
    if @canChangeTutorQty() and TaskPlanStore.canDecreaseTutorExercises(@props.planId)
      <BS.Button onClick={@removeTutorSelection} className="btn-xs hover-circle">
        <Icon type='chevron-down' />
      </BS.Button>
    else
      <span className="circle-btn-placeholder" />

  render: ->
    numSelected = TaskPlanStore.exerciseCount(@props.planId)
    numTutor = TaskPlanStore.getTutorSelections(@props.planId)

    <div className="exercise-controls-bar">
      {@renderDisplayControls()}

      <div className="indicators">
        <div className="num total">
          <h2>{numSelected + numTutor}</h2>
          <span>Total Problems</span>
        </div>

        <div className="num mine">
          <h2>{numSelected}</h2>
          <span>My Selections</span>
        </div>

        <TourAnchor id={"tutor-selections"} className="num tutor">
          <div className="tutor-selections">
            {@renderDecreaseButton()}
            <h2>{numTutor}</h2>
            {@renderIncreaseButton()}
          </div>
          <span>OpenStax Tutor Selections</span>
          <SelectionsTooltip/>
        </TourAnchor>

        {@renderExplanation()}

      </div>

      <div className="actions">
        {@renderActionButtons()}
      </div>
    </div>

module.exports = ExerciseControls
