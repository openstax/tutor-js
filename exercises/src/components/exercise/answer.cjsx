React = require 'react'
_ = require 'underscore'
{AnswerActions, AnswerStore} = require 'stores/answer'

module.exports = React.createClass
  displayName: 'Answer'

  getInitialState: -> {}

  propTypes:
    id: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired
    sync: React.PropTypes.func.isRequired

  updateContent: (event) ->
    AnswerActions.updateContent(@props.id, event.target?.value)
    @sync()

  changeCorrect: (event) ->
    @props.changeAnswer(@props.id)
    @sync()

  updateFeedback: (event) ->
    AnswerActions.updateFeedback(@props.id, event.target?.value)
    @sync()

  sync: ->
    @props.sync()
    @forceUpdate()

  render: ->
    moveUp = <a className="pull-right" onClick={_.partial(@props.moveAnswer, @props.id, 1)}>
      <i className="fa fa-arrow-circle-down"/>
    </a> if @props.canMoveUp

    moveDown = <a className="pull-right" onClick={_.partial(@props.moveAnswer, @props.id, -1)}>
      <i className="fa fa-arrow-circle-up" />
    </a> if @props.canMoveDown

    correctClassname = 'correct-answer' if AnswerStore.isCorrect(@props.id)

    <li className={correctClassname}>
      <p>
        <span className="answer-actions">
          <a className="pull-right" onClick={_.partial(@props.removeAnswer, @props.id)}>
            <i className="fa fa-ban" />
          </a>
          {moveUp}
          {moveDown}
          <a className="pull-right is-correct #{correctClassname}" onClick={@changeCorrect}>
            <i className="fa fa-check-circle-o" />
          </a>
        </span>
      </p>
      <label>Distractor</label>
      <textarea onChange={@updateContent} value={AnswerStore.getContent(@props.id)}>
      </textarea>
      <label>Choice-Level Feedback</label>
      <textarea onChange={@updateFeedback} value={AnswerStore.getFeedback(@props.id)}>
      </textarea>
    </li>
