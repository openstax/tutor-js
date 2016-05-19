React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
BS = require 'react-bootstrap'

ArbitraryHtmlAndMath = require '../html'
ExerciseIdentifierLink = require './identifier-link'
Question = require '../question'

ExercisePreview = React.createClass

  propTypes:
    extractTag:      React.PropTypes.func
    displayFeedback: React.PropTypes.bool
    displayAllTags:  React.PropTypes.bool
    displayFormats:  React.PropTypes.bool
    panelStyle:      React.PropTypes.string
    className:       React.PropTypes.string
    header:          React.PropTypes.element
    hideAnswers:     React.PropTypes.bool
    onOverlayClick:  React.PropTypes.func
    isSelected:      React.PropTypes.bool
    overlayActions:  React.PropTypes.shape(
      message: React.PropTypes.string.isRequired
      handler: React.PropTypes.func.isRequired
    )
    exercise:        React.PropTypes.shape(
      content: React.PropTypes.object
      tags:    React.PropTypes.array
    ).isRequired
    isVerticallyTruncated: React.PropTypes.bool

  getDefaultProps: ->
    panelStyle: 'default'
    overlayActions:  {}
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
    @props.onOverlayClick(ev, @props.exercise)

  onActionClick: (ev, handler) ->
    ev.stopPropagation() if @props.onOverlayClick # needed to prevent click from triggering onOverlay handler
    handler(ev, @props.exercise)

  renderFooter: ->
    <div className="controls">
      {@props.children}
    </div>


  renderControlsOverlay: ->
    <div
      onClick={@onOverlayClick if @props.onOverlayClick}
      className={classnames('controls-overlay', {active: @props.isSelected})}
    >
      <div className='message'>
        {for type, action of @props.overlayActions
          <div key={type}
            className="action #{type}"
            onClick={_.partial(@onActionClick, _, action.handler)}
          >
            <span>{action.message}</span>
          </div>}
      </div>
    </div>

  stimulusHtml: ->
    @props.exercise.content.stimulus_html

  isInteractive: ->
    !!@stimulusHtml().match(/iframe.*[cnx.org|phet.colorado.edu]/)

  isVideo: ->
    !!@stimulusHtml().match(/[youtube|khanacademy]/)

  renderBadges: ->
    badges = []
    if @props.exercise.content.questions.length > 1
      badges.push <span className="mpq">
          <i className='fa fa-pie-chart' /> Multi-part question
        </span>

    if @isInteractive()
      badges.push <span className="interactive">
          <i className='fa fa-object-group' /> Interactive
        </span>

    if @isVideo()
      badges.push <span className="video">
          <i className='fa fa-television' /> Video
        </span>

    badges

  renderSelectedMask: ->
    <div className='selected-mask'></div>

  render: ->
    content = @props.exercise.content

    tags = _.clone @props.exercise.tags
    unless @props.displayAllTags
      tags = _.where tags, is_visible: true
    renderedTags = _.map(_.sortBy(tags, 'name'), @renderTag)
    classes = classnames( 'openstax-exercise-preview', @props.className, {
      'answers-hidden':  @props.hideAnswers
      'has-actions':   not _.isEmpty(@props.overlayActions)
      'is-selected':     @props.isSelected
      'is-interactive':  @isInteractive()
      'actions-on-side': @props.actionsOnSide
      'is-vertically-truncated': @props.isVerticallyTruncated
      'is-displaying-formats':   @props.displayFormats
      'is-displaying-feedback':  @props.displayFeedback
    })

    questions = _.map(content.questions, (question, questionIter) =>
      question = _.omit(question, 'answers') if @props.hideAnswers

      <Question
        key={questionIter}
        className='openstax-question-preview'
        model={question}
        choicesEnabled={false}
        displayFormats={@props.displayFormats}
        show_all_feedback={@props.displayFeedback}
        type='teacher-preview'
      >
        {@props.questionFooters?[questionIter]}
      </Question>
    )

    <BS.Panel
      className={classes}
      bsStyle={@props.panelStyle}
      header={@props.header}
      footer={@renderFooter() if @props.children}
    >
      {@renderSelectedMask() if @props.isSelected}
      {@renderControlsOverlay() unless _.isEmpty(@props.overlayActions)}
      <div className="badges">
        {@renderBadges()}
      </div>
      <ArbitraryHtmlAndMath className='stimulus' block={true} html={content.stimulus_html} />
      {questions}
      <div className='exercise-uid'>Exercise ID: {@props.exercise.content.uid}</div>
      <div className='exercise-tags'>{renderedTags}</div>
    </BS.Panel>

module.exports = ExercisePreview
