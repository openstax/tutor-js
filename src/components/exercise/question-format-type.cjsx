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


  update: -> @forceUpdate()

  componentWillMount: ->
    QuestionStore.addChangeListener(@update)

  componentWillUnmount: ->
    QuestionStore.removeChangeListener(@update)

  propTypes:
    questionId: React.PropTypes.number.isRequired
    sync: React.PropTypes.func.isRequired

  updateFormat: (ev) ->
    formats =  QuestionStore.get(@props.questionId).formats or []
    if ev.target.checked
      formats.push(ev.target.name)
    else
      formats = _.without(formats, ev.target.name)

    # 'true-false' and 'multiple-choice' are mutually exclusive
    if ev.target.name is 'multiple-choice'
      formats = _.without(formats, 'true-false')
    if ev.target.name is 'true-false'
      formats = _.without(formats, 'multiple-choice')

    QuestionActions.setFormats(@props.questionId, formats)
    @props.sync()

  setChoiceRequired: (ev) ->
    QuestionActions.setChoiceRequired(@props.questionId, ev.target.checked)

  isFormatDisabled: (id, required) ->
    id is 'free-response' and required

  render: ->
    formats =  QuestionStore.get(@props.questionId).formats
    isChoiceRequired = QuestionStore.isChoiceRequired(@props.questionId)

    <div className="format-type">
      {for id, name of TYPES
        <BS.Input key={id} name={id} type="checkbox" label={name}
          disabled={@isFormatDisabled(id, isChoiceRequired)}
          checked={_.contains(formats, id)}
          onChange={@updateFormat} />}

      <BS.Input type="checkbox" label="Requires Choices"
        onChange={@setChoiceRequired}
        checked={isChoiceRequired} />
    </div>


module.exports = QuestionFormatType
