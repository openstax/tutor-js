React = require 'react'
_ = require 'underscore'

Answer = require './answer'
{QuestionActions, QuestionStore} = require '../stores/question'
{AnswerActions, AnswerStore} = require '../stores/answer'

module.exports = React.createClass
  displayName: 'Question'

  getInitialState: -> {}

  changeAnswer: (answerId) ->
    curAnswer = QuestionStore.getCorrectAnswer(@props.id)
    QuestionActions.setCorrectAnswer(@props.id, answerId, curAnswer?.id)
    @props.sync()

  updateStimulus: (event) ->
    QuestionActions.updateStimulus(@props.id, event.target?.value)
    @props.sync()

  updateStem: (event) ->
    QuestionActions.updateStem(@props.id, event.target?.value)
    @props.sync()

  updateSolution: (event) ->
    QuestionActions.updateSolution(@props.id, event.target?.value)
    @props.sync()

  addAnswer: ->
    QuestionActions.addNewAnswer(@props.id)
    @props.sync()

  removeAnswer:(answerId) ->
    QuestionActions.removeAnswer(@props.id, answerId)
    @props.sync()

  moveAnswer: (answerId, direction) ->
    QuestionActions.moveAnswer(@props.id, answerId, direction)
    @props.sync()

  multipleChoiceClicked: (event) -> QuestionActions.toggleMultipleChoiceFormat(@props.id)
  freeResponseClicked: (event) -> QuestionActions.toggleFreeResponseFormat(@props.id)
  preserveOrderClicked: (event) -> QuestionActions.togglePreserveOrder(@props.id)

  render: ->
    { id, removeQuestion, moveQuestion, canMoveLeft, canMoveRight } = @props
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

      {if removeQuestion
        <div>
          {if canMoveRight
            <a className="move-question" onClick={_.partial(moveQuestion, id, 1)}>
              <i className="fa fa-arrow-circle-right"/>
            </a>
          }
          <a className="remove-question" onClick={removeQuestion}>
            <i className="fa fa-trash" />
            Remove Question
          </a>
          {if canMoveLeft
            <a className="move-question" onClick={_.partial(moveQuestion, id, -1)}>
              <i className="fa fa-arrow-circle-left"/>
            </a>
          }
        </div>
      }
      <div>
        <label>Question Formats</label>
      </div>
      <div>
        <input onChange={@multipleChoiceClicked}
          id="multipleChoiceFormat#{id}"
          type="checkbox"
          defaultChecked={QuestionStore.isMultipleChoice(id)} />
        <label htmlFor="multipleChoiceFormat#{id}">Multiple Choice</label>
      </div>
      <div>
        <input onChange={@freeResponseClicked}
          id="freeResponseFormat#{id}"
          type="checkbox"
          defaultChecked={QuestionStore.isFreeResponse(id)}
        /> <label htmlFor="freeResponseFormat#{id}">Requires viewing choices to answer question</label>
      </div>
      <div>
        <label>Question Stem</label>
        <textarea onChange={@updateStem} defaultValue={QuestionStore.getStem(id)}></textarea>
      </div>
      <div>
        <label>Detailed Solution</label>
        <textarea onChange={@updateSolution} defaultValue={QuestionStore.getSolution(id)}></textarea>
      </div>
      <div>
        <label>
          Answers:
        </label>
        <a className="pull-right" onClick={@addAnswer}>Add New</a>
        <p>
          <input onChange={@preserveOrderClicked}
            id="preserveOrder#{id}"
            type="checkbox"
            defaultChecked={QuestionStore.isOrderPreserved(id)}
          /> <label htmlFor="preserveOrder#{id}">Order Matters</label>
        </p>
        <ol>
          {answers}
        </ol>
      </div>
    </div>
