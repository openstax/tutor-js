React = require 'react'
_ = require 'underscore'
{AnswerActions, AnswerStore} = require '../stores/answer'

module.exports = React.createClass
  displayName: 'Answer'

  getInitialState: -> {}

  updateContent: (event) ->
    AnswerActions.updateContent(@props.id, event.target?.value)
    @props.sync()

  changeCorrect: (event) ->
    @props.changeAnswer(@props.id)
    @props.sync()

  updateFeedback: (event) ->
    AnswerActions.updateFeedback(@props.id, event.target?.value)
    @props.sync()

  render: ->
    isCorrect = AnswerStore.isCorrect(@props.id)

    removeAnswer = _.partial(@props.removeAnswer, @props.id)


    moveUp = <a className="pull-right" onClick={_.partial(@props.moveAnswer, @props.id, 1)}>
      <i className="fa fa-arrow-circle-down"/>
    </a> if @props.canMoveUp

    moveDown = <a className="pull-right" onClick={_.partial(@props.moveAnswer, @props.id, -1)}>
      <i className="fa fa-arrow-circle-up" />
    </a> if @props.canMoveDown

    correctClassname = 'correct-answer' if isCorrect

    <li className={correctClassname}>
      <p>
        <span className="answer-actions">
          <a className="pull-right" onClick={removeAnswer}>
            <i className="fa fa-ban" />
          </a>
          {moveUp}
          {moveDown}
          <a className="pull-right is-correct #{correctClassname}" onClick={@changeCorrect}>
            <i className="fa fa-check-circle-o" />
          </a>
        </span>
      </p>
      <label>Answer Content</label>
      <textarea onChange={@updateContent} defaultValue={AnswerStore.getContent(@props.id)}>
      </textarea>
      <label>Answer Feedback</label>
      <textarea onChange={@updateFeedback} defaultValue={AnswerStore.getFeedback(@props.id)}>
      </textarea>
    </li>
