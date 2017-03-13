React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
camelCase = require 'lodash/camelCase'

{
  PERSONALIZED_GROUP,
  SPACED_PRACTICE_GROUP,
  ALIASES,
  LABELS,
  getHelpText
} = require '../../helpers/step-helps'
Markdown = require '../markdown'

DEFAULT_GROUP =
  show: false
REVIEW_GROUP =
  show: true
  label: LABELS[SPACED_PRACTICE_GROUP]

PERSONALIZED_GROUP =
  show: true
  label: LABELS[PERSONALIZED_GROUP]

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
    return null unless RULES[group]?

    if RULES[group].show
      className = ALIASES[group] or group
      labels = @getGroupLabel(group, related_content)
      isSpacedPractice = group is SPACED_PRACTICE_GROUP

      groupDOM = [
        <i className="icon-sm icon-#{className}" key='group-icon'></i>
        <span className='openstax-step-group-label' key='group-label'>{labels}</span>
      ]

    if RULES[group].show
      popover = <BS.Popover id="instructions" ref="popover" className="openstax instructions">
        {getHelpText[group](project)}
      </BS.Popover>
      groupDOM.push(
        <BS.OverlayTrigger key="info" placement="bottom" overlay={popover}>
          <i className="fa fa-info-circle" />
        </BS.OverlayTrigger>
      )
    <div className='openstax-step-group'>
      {groupDOM}
    </div>

module.exports = ExerciseGroup
