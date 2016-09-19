React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
camelCase = require 'camelcase'

ChapterSectionMixin = require '../chapter-section-mixin'
ExerciseIdentifierLink = require '../exercise-identifier-link'

{PERSONALIZED_GROUP, SPACED_PRACTICE_GROUP, LABELS, getHelpText} = require '../../helpers/step-helps'

DEFAULT_GROUP =
  show: false
REVIEW_GROUP =
  show: true
  label: LABELS[SPACED_PRACTICE_GROUP]
  makeToolTipText: _.partial(getHelpText[SPACED_PRACTICE_GROUP], _, false)

PERSONALIZED_GROUP =
  show: true
  label: LABELS[PERSONALIZED_GROUP]
  makeToolTipText: _.partial(getHelpText[PERSONALIZED_GROUP], _, false)

RULES =
  default: DEFAULT_GROUP
  core: DEFAULT_GROUP
  recovery: DEFAULT_GROUP
  personalized: PERSONALIZED_GROUP
  'spaced practice': REVIEW_GROUP

ExerciseGroup = React.createClass
  displayName: 'ExerciseGroup'

  propTypes:
    group: React.PropTypes.oneOf(_.keys(RULES)).isRequired
    project: React.PropTypes.oneOf(['tutor', 'concept-coach']).isRequired

  getDefaultProps: ->
    group: 'default'
    related_content: []

  getPossibleGroups: ->
    _.keys(RULES)

  getGroupLabel: (group, related_content) ->

    if RULES[group].label?
      labels = RULES[group].label

    labels

  render: ->
    {group, related_content, exercise_uid, project} = @props
    groupDOM = []

    if RULES[group].show
      className = group.replace(' ', '_')
      labels = @getGroupLabel(group, related_content)
      isSpacedPractice = group is SPACED_PRACTICE_GROUP
      icon = <i className="icon-sm icon-#{className}" key='group-icon'></i>

      spacedPracticeHeading = <p>
        <b>What is {LABELS[SPACED_PRACTICE_GROUP].toLowerCase()}?</b>
      </p>

      groupDOM = [
        icon
        <span className='openstax-step-group-label' key='group-label'>{labels}</span>
      ]

    if RULES[group].show and RULES[group].makeToolTipText
      popover = <BS.Popover id="instructions" ref="popover" className="openstax instructions">
        {spacedPracticeHeading if isSpacedPractice}
        {RULES[group].makeToolTipText(project)}
      </BS.Popover>
      groupDOM.push  <BS.OverlayTrigger placement="bottom" overlay={popover}>
        <i className="fa fa-info-circle" />
      </BS.OverlayTrigger>

    <div className='openstax-step-group'>
      {groupDOM}
    </div>

module.exports = ExerciseGroup
