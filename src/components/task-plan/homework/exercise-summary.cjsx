React = require 'react'
BS = require 'react-bootstrap'
{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'

ExerciseSummary = React.createClass
  displayName: 'ExerciseSummary'

  propTypes:
    planId: React.PropTypes.string.isRequired
    canAdd: React.PropTypes.bool
    canReview: React.PropTypes.bool
    addClicked: React.PropTypes.func
    reviewClicked: React.PropTypes.func

  addTutorSelection: ->
    TaskPlanActions.updateTutorSelection(@props.planId, 1)

  removeTutorSelection: ->
    TaskPlanActions.updateTutorSelection(@props.planId, -1)

  render: ->
    numSelected = TaskPlanStore.getExercises(@props.planId).length
    numTutor = TaskPlanStore.getTutorSelections(@props.planId)
    total = numSelected + numTutor
    buttonColumnSize = 2
    explanation =
      <BS.Col sm={6} md={2} className="tutor-added-later"><em>
        Tutor selections are added later to support spaced practice and personalized learning.
      </em></BS.Col>

    if @props.canReview and numSelected
      buttons = <span><BS.Button 
        bsStyle="primary" 
        className="-review-exercises"  
        onClick={@props.reviewClicked}>Next
      </BS.Button>
      <BS.Button
        bsStyle="default" 
        className="-cancel-add"  
        onClick={@props.onCancel}>Cancel
      </BS.Button></span>

    else if @props.canAdd
      explanation = null
      buttonColumnSize = 4

      buttons = <BS.Button bsStyle="default" 
        className="-add-exercises" 
        onClick={@props.addClicked}>Add More...</BS.Button>

    if TaskPlanStore.canDecreaseTutorExercises(@props.planId)
      removeSelection =
        <BS.Button onClick={@removeTutorSelection} className="btn-xs -move-exercise-down">
          <i className="fa fa-arrow-down"/>
        </BS.Button>

    if TaskPlanStore.canIncreaseTutorExercises(@props.planId)
      addSelection =
        <BS.Button onClick={@addTutorSelection} className="btn-xs -move-exercise-up">
          <i className="fa fa-arrow-up"/>
        </BS.Button>

    <BS.Panel className="exercise-summary" bsStyle="default">
      <BS.Grid>
        <BS.Row>
          <BS.Col sm={6} md={2} className="total">
            <h2>{total}</h2>
            Total Problems
          </BS.Col>
          <BS.Col sm={6} md={2} className="num-selected">
            <h2>{numSelected}</h2>
            My Selections
          </BS.Col>
          <BS.Col sm={6} md={2} className="num-tutor">
            <div className="tutor-selections">
              {removeSelection}
              <h2>{numTutor}</h2>
              {addSelection}
            </div>
            Tutor Selections
          </BS.Col>
          {explanation}
          <BS.Col sm={6} md={buttonColumnSize}>
            {buttons}
          </BS.Col>
          <BS.Col sm={6} md={2}>

          </BS.Col>
        </BS.Row>
      </BS.Grid>
    </BS.Panel>

module.exports = ExerciseSummary
