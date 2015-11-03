React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
BS = require 'react-bootstrap'
ArbitraryHtmlAndMath = require './html'
{ExerciseStore} = require '../flux/exercise'


ExerciseCard = React.createClass

  PropTypes:
    displayFeedback: React.PropTypes.bool
    panelStyle: React.PropTypes.string
    header:     React.PropTypes.element
    exercise:   React.PropTypes.shape(
      content: React.PropTypes.object
      tags:    React.PropTypes.array
    ).isRequired

  getDefaultProps: ->
    panelStyle: 'default'

  renderAnswer: (answer) ->
    classes = classnames 'answers-answer',
      correct: (answer.correctness is '1.0')

    <div key={answer.id} className={classes}>
      <div className="answer-letter" />
      <div className="answer">
        <ArbitraryHtmlAndMath className="choice" block={false} html={answer.content_html} />
        <ArbitraryHtmlAndMath className="feedback" block={false} html={answer.feedback_html} />
      </div>
    </div>

  renderTag: (tag) ->
    {content, isLO} = ExerciseStore.getTagContent(tag)
    classes = if isLO
      content = "LO: #{content}" if isLO
      'lo-tag'
    else
      'exercise-tag'
    <span key={tag.id or tag.name} className={classes}>{content}</span>

  render: ->
    content = @props.exercise.content
    question = content.questions[0]
    renderedAnswers = _(question.answers).chain()
      .sortBy('id')
      .map(@renderAnswer)
      .value()
    tags = _.clone @props.exercise.tags
    # Display the exercise uid as a tag
    tags.push(name: "ID: #{@props.exercise.content.uid}")
    renderedTags = _.map(_.sortBy(tags, 'name'), @renderTag)

    classes = classnames 'card', 'exercise',
      'is-displaying-feedback': @props.displayFeedback

    <BS.Panel
      className={classes}
      bsStyle={@props.panelStyle}
      header={@props.header}
      onClick={@props.toggleExercise}>
      <ArbitraryHtmlAndMath className='-stimulus' block={true} html={content.stimulus_html} />
      <ArbitraryHtmlAndMath className='stem' block={true} html={question.stem_html} />
      <div className='answers-table'>{renderedAnswers}</div>
      <div className='detailed-solution'>
        <div className='header'>Detailed solution</div>
        <ArbitraryHtmlAndMath className="solution" block
          html={_.first(question.solutions)?.content_html} />
      </div>
      <div className='exercise-tags'>{renderedTags}</div>
      {@props.children}
    </BS.Panel>

module.exports = ExerciseCard
