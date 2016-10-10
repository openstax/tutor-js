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

  render: ->
    <div className="format-type">
      {for id, name of TYPES
        <BS.FormGroup key={id}>
          <BS.ControlLabel>{name}</BS.ControlLabel>
          <BS.FormControl autoFocus
            type="radio"
            ref="input"
            name={"#{@props.questionId}-formats"}
            value={id}
            onChange={@update}
            onClick={@updateFormat}
            checked={@isFormatChecked(id)}
          />
        </BS.FormGroup>}

      {<BS.FormGroup className="requires-choices">
        <BS.ControlLabel>Requires Choices</BS.ControlLabel>
        <BS.FormControl type="checkbox"
          checked={@doesRequireChoices()} onChange={@setChoiceRequired} />
      </BS.FormGroup> if QuestionStore.hasFormat(@props.questionId, 'multiple-choice')}
    </div>


module.exports = QuestionFormatType
