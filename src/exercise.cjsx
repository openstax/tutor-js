# @csx React.DOM
React = require 'react'

CardList = require './card-list'
Background = require './background'
Question = require './question'
PrimaryAdd = require './primary-add'
{MULTI_MODES} = require './multi-mode'
{ExerciseActions, ExerciseStore} = require './flux/exercise'

module.exports = React.createClass
  displayName: 'Exercise'

  getInitialState: ->
    addingQuestion: null

  componentWillMount: ->
    ExerciseStore.addChangeListener(@update)

  update: -> @setState({}) # Just enough to trigger a re-render

  render: ->
    classes = null
    classes = 'has-single-question' if @props.config.questions.length is 1

    cards = [<Background model={@props.config} />]
    for question in @props.config.questions
      cards.push(<Question model={question} parent={@props.config} />)

    if @state.addingQuestion
      addOrBlankQuestion = null
      cards.push(
        <Question
          model={@state.addingQuestion}
          parent={@props.config}
          initialMode={MULTI_MODES.EDIT}
          onCancel={@onCancelAdd}
          onDone={@onDoneAdd} />
      )
    else
      addOrBlankQuestion =
        <PrimaryAdd title="Add a New Question" onClick={@onAdd} />

    <div className="exercise">
      <CardList className={classes}>{cards}</CardList>
      {addOrBlankQuestion}
    </div>

  onAdd: ->
    blankQuestion =
      formats: ['multiple-choice']
      stem_html: ''
      answers: []
    @setState {addingQuestion: blankQuestion}

  onCancelAdd: ->
    @setState {addingQuestion: null}

  onDoneAdd: (stem, answers) ->
    question =
      formats: ['multiple-choice']
      stem_html: stem
      answers: answers

    ExerciseActions.addQuestion(@props.config, question)
    @setState {addingQuestion: null}
