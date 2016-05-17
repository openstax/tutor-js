React = require 'react'
_ = require 'underscore'

keysHelper = require '../../helpers/keys'

KEYS =
  'multiple-choice-numbers': _.range(1, 10) # 1 - 9

# a - i
KEYS['multiple-choice-alpha'] = _.map(KEYS['multiple-choice-numbers'], _.partial(keysHelper.getCharFromNumKey, _, null))

KEYS['multiple-choice'] = _.zip(KEYS['multiple-choice-numbers'], KEYS['multiple-choice-alpha'])

KEYSETS_PROPS = _.keys(KEYS)
KEYSETS_PROPS.push(null) # keySet could be null for disabling keyControling

ArbitraryHtmlAndMath = require '../html'
{Answer} = require './answer'
{Feedback} = require './feedback'
Instructions = require './instructions'

idCounter = 0


isAnswerChecked = (answer, chosenAnswer) ->
  isChecked = answer.id in chosenAnswer

AnswersTable = React.createClass
  displayName: 'AnswersTable'
  propTypes:
    model: React.PropTypes.object.isRequired
    type: React.PropTypes.string.isRequired
    answer_id: React.PropTypes.string
    correct_answer_id: React.PropTypes.string
    feedback_html: React.PropTypes.string
    answered_count: React.PropTypes.number
    show_all_feedback: React.PropTypes.bool
    onChange: React.PropTypes.func
    onChangeAttempt: React.PropTypes.func
    keySet: React.PropTypes.oneOf(KEYSETS_PROPS)

  getDefaultProps: ->
    type: 'student'
    show_all_feedback: false
    keySet: 'multiple-choice'

  getInitialState: ->
    answer_id: null

  onChangeAnswer: (answer, changeEvent) ->
    if @props.onChange?
      @setState(answer_id: answer.id)
      @props.onChange(answer)
    else
      changeEvent.preventDefault()
      @props.onChangeAttempt?(answer)

  render: ->
    {
      model, type, answered_count, choicesEnabled, correct_answer_id,
      answer_id, feedback_html, show_all_feedback, keySet, project
    } = @props

    {answers, id} = model
    return null unless answers?.length > 0

    chosenAnswer = [answer_id, @state.answer_id]
    checkedAnswerIndex = null
    hasCorrectAnswer = !! correct_answer_id

    questionAnswerProps =
      qid: id or "auto-#{idCounter++}"
      correctAnswerId: correct_answer_id
      hasCorrectAnswer: hasCorrectAnswer
      chosenAnswer: chosenAnswer
      onChangeAnswer: @onChangeAnswer
      type: type
      answered_count: answered_count
      disabled: not choicesEnabled
      show_all_feedback: show_all_feedback

    answersHtml = _.chain(answers)
      .map (answer, i) ->
        additionalProps = {answer, iter: i, key: "#{questionAnswerProps.qid}-option-#{i}", keyControl: KEYS[keySet]?[i]}
        answerProps = _.extend({}, additionalProps, questionAnswerProps)
        checkedAnswerIndex = i if isAnswerChecked(answer, chosenAnswer)

        <Answer {...answerProps}/>
      .value()

    feedback = <Feedback key='question-mc-feedback'>{feedback_html}</Feedback> if feedback_html
    answersHtml.splice(checkedAnswerIndex + 1, 0, feedback) if feedback? and checkedAnswerIndex?

    instructions = <Instructions
      project={project}
    /> if model.formats.length > 1 and not (hasCorrectAnswer or type is 'teacher-preview')

    <div className='answers-table'>
      {instructions}
      {answersHtml}
    </div>

module.exports = {AnswersTable}
