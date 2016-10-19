React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{QuestionActions, QuestionStore} = require 'stores/question'


PREFIX = 'format'
TYPES =
  'multiple-choice' : 'Multiple Choice'
  'true-false'      : 'True/False'

# Temporarily removed as options (not needed & causes 500 on BE)
#  'vocabulary'      : 'Vocabulary'
#  'open-ended'      : 'Open Ended'

QuestionFormatType = React.createClass

  propTypes:
    questionId: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired
    sync: React.PropTypes.func.isRequired

  update: -> @forceUpdate()

  componentWillMount: ->
    QuestionStore.addChangeListener(@update)

  componentWillUnmount: ->
    QuestionStore.removeChangeListener(@update)

  updateFormat: (ev) ->
    selected = ev.target.value
    for id, name of TYPES
      QuestionActions.toggleFormat(@props.questionId, id, selected is id)
    @props.sync()

  isFormatChecked: (name) ->
    QuestionStore.hasFormat(@props.questionId, name)

  setChoiceRequired: (ev) ->
    QuestionActions.toggleFormat(@props.questionId, 'free-response', not ev.target.checked)
    @props.sync()

  doesRequireChoices: ->
    not @isFormatChecked('free-response')

  preserveOrderClicked: (event) ->
    QuestionActions.togglePreserveOrder(@props.questionId)
    @props.sync()

  render: ->
    <div className="format-type">
      {for id, name of TYPES
        <div key={id}>
          <input
            type="radio"
            id={"input-#{id}"}
            name={"#{@props.questionId}-formats"}
            value={id}
            onChange={@update}
            onClick={@updateFormat}
            checked={@isFormatChecked(id)}
          />
          <label htmlFor={"input-#{id}"}>{name}</label>
        </div>}

      {<div className="requires-choices">
        <input type="checkbox" id="input-rq"
          checked={@doesRequireChoices()} onChange={@setChoiceRequired} />
        <label htmlFor="input-rq">Requires Choices</label>
      </div> if QuestionStore.hasFormat(@props.questionId, 'multiple-choice')}

      {<div className="order-matters">
        <input type="checkbox" id="input-om"
          checked={QuestionStore.isOrderPreserved(@props.questionId)} onChange={@preserveOrderClicked} />
        <label htmlFor="input-om">Order Matters</label>
      </div> if QuestionStore.hasFormat(@props.questionId, 'multiple-choice')}

    </div>


module.exports = QuestionFormatType
