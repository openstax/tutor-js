React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{QuestionActions, QuestionStore} = require '../stores/question'


PREFIX = 'format'
TYPES =
  'multiple-choice' : 'Multiple Choice'
  'true-false'      : 'True/False'
  'free-response'   : 'Open Ended'
  'vocabulary'      : 'Vocabulary'

QuestionFormatType = React.createClass

  getInitialState: -> { isChoiceRequired: false }
  update: -> @forceUpdate()

  componentWillMount: ->
    QuestionStore.addChangeListener(@update)

  componentWillUnmount: ->
    QuestionStore.removeChangeListener(@update)

  propTypes:
    questionId: React.PropTypes.number.isRequired

  updateFormat: (ev) ->
    formats =  QuestionStore.get(@props.questionId).formats
    if ev.target.checked
      formats.push(ev.target.name)
    else
      formats = _.without(formats, ev.target.name)
    QuestionActions.setFormats(@props.questionId, _.unique(formats))

  setChoiceRequired: (ev) ->

    isChoiceRequired = ev.target.checked
    formats =  QuestionStore.get(@props.questionId).formats

    if isChoiceRequired # remove 'free-response'
      formats = _.without( formats, 'free-response' )
    else # Must have 'multiple-choice', 'free-response'
      formats = _.unique formats.concat(['multiple-choice', 'free-response'] )

    QuestionActions.setFormats(@props.questionId, _.unique formats)

    @setState({isChoiceRequired})


  isFormatDisabled: (id) ->
    id is 'free-response' and @state.isChoiceRequired

  render: ->
    formats =  QuestionStore.get(@props.questionId).formats


    <div className="format-type">
      {for id, name of TYPES
        <BS.Input key={id} name={id} type="checkbox" label={name}
          disabled={@isFormatDisabled(id)}
          checked={_.contains(formats, id)}
          onChange={@updateFormat} />}

      <BS.Input type="checkbox" label="Requires Choices"
        onChange={@setChoiceRequired}
        checked={@state.isChoiceRequired} />
    </div>


module.exports = QuestionFormatType
