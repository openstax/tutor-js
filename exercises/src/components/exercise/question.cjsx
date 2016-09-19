React = require 'react'
BS = require 'react-bootstrap'

_ = require 'underscore'

{SuretyGuard} = require 'shared'
QuestionFormatType = require './question-format-type'
Answer = require './answer'
{QuestionActions, QuestionStore} = require 'stores/question'
{AnswerActions, AnswerStore} = require 'stores/answer'

module.exports = React.createClass
  displayName: 'Question'

  getInitialState: -> {}
  update: -> @forceUpdate()

  componentWillMount: ->
    QuestionStore.addChangeListener(@update)

  componentWillUnmount: ->
    QuestionStore.removeChangeListener(@update)

  propTypes:
    id: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired
    sync: React.PropTypes.func.isRequired

  sync: ->
    @props.sync()
    @forceUpdate()

  changeAnswer: (answerId) ->
    curAnswer = QuestionStore.getCorrectAnswer(@props.id)
    QuestionActions.setCorrectAnswer(@props.id, answerId, curAnswer?.id)
    @sync()

  updateStimulus: (event) ->
    QuestionActions.updateStimulus(@props.id, event.target?.value)
    @sync()

  updateStem: (event) ->
    QuestionActions.updateStem(@props.id, event.target?.value)
    @sync()

  updateSolution: (event) ->
    QuestionActions.updateSolution(@props.id, event.target?.value)
    @sync()

  addAnswer: ->
    QuestionActions.addNewAnswer(@props.id)
    @sync()

  removeAnswer:(answerId) ->
    QuestionActions.removeAnswer(@props.id, answerId)
    @sync()

  moveAnswer: (answerId, direction) ->
    QuestionActions.moveAnswer(@props.id, answerId, direction)
    @sync()

  multipleChoiceClicked: (event) -> QuestionActions.toggleMultipleChoiceFormat(@props.id)
  freeResponseClicked: (event) -> QuestionActions.toggleFreeResponseFormat(@props.id)
  preserveOrderClicked: (event) -> QuestionActions.togglePreserveOrder(@props.id)

  render: ->
    { id, removeQuestion, moveQuestion, canMoveLeft, canMoveRight } = @props
    invalid = QuestionStore.validate(id)
    answers = []

    for answer, index in QuestionStore.getAnswers(id)
      answers.push(<Answer key={answer.id}
        sync={@props.sync}
        id={answer.id}
        canMoveUp={index isnt QuestionStore.getAnswers(id).length - 1}
        canMoveDown={index isnt 0}
        moveAnswer={@moveAnswer}
        removeAnswer={@removeAnswer}
        changeAnswer={@changeAnswer}/>)

    <div className="question">
      {if removeQuestion # if we can remove it, that means we're a MPQ
        <div className="controls">
          {if canMoveLeft
            <a className="move-question" onClick={_.partial(moveQuestion, id, -1)}>
              <i className="fa fa-arrow-circle-left"/>
            </a>
          }
          <SuretyGuard
            onConfirm={removeQuestion}
            onlyPromptIf={ -> QuestionStore.isChanged(id)}
            message="Removing a question will permanently remove the question and it's answers"
          >
            <a className="remove-question">
              <i className="fa fa-trash" />
              Remove Question
            </a>
          </SuretyGuard>
          {if canMoveRight
            <a className="move-question" onClick={_.partial(moveQuestion, id, 1)}>
              <i className="fa fa-arrow-circle-right"/>
            </a>
          }
        </div>
      }
      {<BS.Alert bsStyle="warning"
        >To save your work, you must fill out the {invalid.part}</BS.Alert> unless invalid.valid}

      <QuestionFormatType sync={@props.sync} questionId={id} />

      {<BS.Input type="checkbox" label="Order Matters"
        onChange={@preserveOrderClicked}
        checked={QuestionStore.isOrderPreserved(id)}
        /> if QuestionStore.hasFormat(id, 'multiple-choice')}

      <div>
        <label>Question Stem</label>
        <textarea onChange={@updateStem} value={QuestionStore.getStem(id)}></textarea>
      </div>
      <div>
        <label>
          Answers:
        </label>
        <a className="pull-right" onClick={@addAnswer}>Add New</a>
        <ol>
          {answers}
        </ol>
      </div>
      <div>
        <label>Detailed Solution</label>
        <textarea onChange={@updateSolution} value={QuestionStore.getSolution(id)}></textarea>
      </div>

    </div>
