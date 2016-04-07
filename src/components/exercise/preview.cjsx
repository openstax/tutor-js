React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
BS = require 'react-bootstrap'

ArbitraryHtmlAndMath = require '../html'
ExerciseIdentifierLink = require './identifier-link'
Question = require '../question'

ExercisePreview = React.createClass

  propTypes:
    extractTag: React.PropTypes.func
    displayFeedback: React.PropTypes.bool
    panelStyle: React.PropTypes.string
    className:  React.PropTypes.string
    header:     React.PropTypes.element
    displayAllTags: React.PropTypes.bool
    hideAnswers: React.PropTypes.bool
    toggleExercise: React.PropTypes.func
    isSelected: React.PropTypes.bool
    hoverMessage: React.PropTypes.string
    exercise:   React.PropTypes.shape(
      content: React.PropTypes.object
      tags:    React.PropTypes.array
    ).isRequired

  getDefaultProps: ->
    panelStyle: 'default'
    extractTag: (tag) ->
      content = _.compact([tag.name, tag.description]).join(' ') or tag.id
      isLO = _.include(['lo', 'aplo'], tag.type)
      {content, isLO}

  renderTag: (tag) ->
    {content, isLO} = @props.extractTag(tag)
    classes = if isLO
      content = "LO: #{content}" if isLO
      'lo-tag'
    else
      'exercise-tag'
    <span key={tag.id or tag.name} className={classes}>{content}</span>

  onOverlayClick: (ev) ->
    @props.toggleExercise(ev, not @props.isSelected)

  renderFooter: ->
    <div className="controls">
      {@props.children}
      <ExerciseIdentifierLink exerciseId={@props.exercise.content.uid} />
    </div>

  renderToggleOverlay: ->
    <div onClick={@onOverlayClick} className={classnames('toggle-mask', {active: @props.isSelected})}>
      <div className='message'>
        {@props.hoverMessage}
      </div>
    </div>

  render: ->
    content = @props.exercise.content
    question = content.questions[0]

    unless @props.hideAnswers
      renderedAnswers = _.map(question.answers, @renderAnswer)

    tags = _.clone @props.exercise.tags
    unless @props.displayAllTags
      tags = _.where tags, is_visible: true
    renderedTags = _.map(_.sortBy(tags, 'name'), @renderTag)
    classes = classnames( 'openstax-exercise-preview', @props.className, {
      'answers-hidden': @props.hideAnswers,
      'is-selectable' : @props.toggleExercise?
      'is-selected': @props.isSelected
      'is-displaying-feedback': @props.displayFeedback
    })

    questions = _.map(content.questions, (question, questionIter) =>
      question = _.omit(question, 'answers') if @props.hideAnswers

      details = <div className='detailed-solution' key='solution'>
        <div className='header'>Detailed solution</div>
        <ArbitraryHtmlAndMath className="solution" block
          html={_.pluck(question.collaborator_solutions, 'content_html').join('')}
        />
      </div>

      <Question
        className='openstax-question-preview'
        model={question}
        choicesEnabled={false}
        show_all_feedback={@props.displayFeedback}
        type='teacher-preview'
        details={details}>
        {@props.questionFooters?[questionIter]}
      </Question>
    )

    <BS.Panel
      className={classes}
      bsStyle={@props.panelStyle}
      header={@props.header}
      footer={@renderFooter()}
    >
      {@renderToggleOverlay() if @props.toggleExercise?}
      <ArbitraryHtmlAndMath className='-stimulus' block={true} html={content.stimulus_html} />
      {questions}
      <div className='exercise-tags' key='tags'>{renderedTags}</div>
    </BS.Panel>

module.exports = ExercisePreview
