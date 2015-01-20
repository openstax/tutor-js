# @csx React.DOM
React = require 'react'

CardList = require './card-list'
Background = require './background'
Question = require './question'
{ExerciseStore} = require './flux/exercise'

module.exports = React.createClass
  displayName: 'Exercise'

  componentWillMount: ->
    ExerciseStore.addChangeListener(@update)

  update: -> @setState({}) # Just enough to trigger a re-render

  render: ->
    classes = null
    classes = 'has-single-question' if @props.config.questions.length is 1

    cards = [<Background model={@props.config} />]
    for question in @props.config.questions
      cards.push(<Question model={question} parent={@props.config} />)

    <CardList className={classes}>{cards}</CardList>
