React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{QuestionActions, QuestionStore} = require 'stores/question'


PREFIX = 'format'
TYPES =
  'multiple-choice' : 'Multiple Choice'
  'true-false'      : 'True/False'
  'requires-choices': 'Requires Choices'

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
    QuestionActions.toggleFormat(@props.questionId, ev.target.name, ev.target.checked)
    @props.sync()

  isFormatChecked: (name) ->
    QuestionStore.hasFormat(@props.questionId, name)

  isFormatDisabled: (id, required) ->
    id is 'free-response' and required

  render: ->
    formats =  QuestionStore.get(@props.questionId).formats

    <div className="format-type">
      {for id, name of TYPES
        <BS.Input key={id} name={id} type="checkbox" label={name}
          checked={@isFormatChecked(id)}
          onChange={@updateFormat} />}
    </div>


module.exports = QuestionFormatType
