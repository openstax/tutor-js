React = require 'react'
BS = require 'react-bootstrap'
{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'

# Throttle events to only fire when a page is redrawn
throttle = (type, name, obj) ->
  obj = obj or window
  running = false
  func = ->
    if running then return
    running = true
    requestAnimationFrame  ->
      obj.dispatchEvent(new CustomEvent(name))
      running = false

  obj.addEventListener(type, func)
  return func

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

  componentDidMount: ->
    el = @getDOMNode()
    @staticPosition = @getPosition(el)
    @handleScroll() # Update scroll position immediately on mount
    @optimizedScrollFunc = throttle('scroll', 'optimizedScroll')
    window.addEventListener('optimizedScroll', @handleScroll)

  componentWillUnmount: ->
    window.removeEventListener('scroll', @optimizedScrollFunc)
    window.removeEventListener('optimizedScroll', @handleScroll)

  getPosition: (el) -> el.getBoundingClientRect().top - document.body.getBoundingClientRect().top

  handleScroll: (e) ->
    el = @getDOMNode()

    if document.body.scrollTop + 60 > @staticPosition
      el.classList.add('navbar', 'navbar-fixed-top', 'navbar-fixed-top-lower')
      document.body.style.marginTop = '120px'
    else
      el.classList.remove('navbar', 'navbar-fixed-top', 'navbar-fixed-top-lower')
      document.body.style.marginTop = '0'
      @staticPosition = @getPosition(el)

  render: ->
    numSelected = TaskPlanStore.getExercises(@props.planId).length
    numTutor = TaskPlanStore.getTutorSelections(@props.planId)
    total = numSelected + numTutor

    if @props.canReview and numSelected
      button = <BS.Button 
        bsStyle="primary" 
        className="-review-exercises"  
        onClick={@props.reviewClicked}>Review
      </BS.Button>

    else if @props.canAdd
      button = <BS.Button 
        bsStyle="primary" 
        className="-add-exercises" 
        onClick={@props.addClicked}>Add More...
      </BS.Button>

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
          <BS.Col sm={6} md={2} className="selections-title">Selections</BS.Col>
          <BS.Col sm={6} md={2} className="total"><h2>{total}</h2></BS.Col>
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
          <BS.Col sm={6} md={2} className="tutor-added-later"><em>
            Tutor selections are added later to support spaced practice and personalized learning.
          </em></BS.Col>
          <BS.Col sm={6} md={2}>
            {button}
          </BS.Col>
        </BS.Row>
      </BS.Grid>
    </BS.Panel>

module.exports = ExerciseSummary
