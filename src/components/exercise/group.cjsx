React = require 'react'
_ = require 'underscore'

camelCase = require 'camelcase'

ChapterSectionMixin = require '../chapter-section-mixin'
ExerciseIdentifierLink = require '../exercise-identifier-link'
DEFAULT_GROUP =
  show: false

RULES =
  default: DEFAULT_GROUP
  core: DEFAULT_GROUP
  recovery: DEFAULT_GROUP
  personalized:
    show: true
    label: 'Personalized'
  #  TODO deprecate spaced practice when BE is updated
  'spaced practice':
    show: true
  spaced_practice:
    show: true

ExerciseGroup = React.createClass
  displayName: 'ExerciseGroup'
  mixins: [ChapterSectionMixin]

  propTypes:
    group: React.PropTypes.oneOf(_.keys(RULES)).isRequired
    related_content: React.PropTypes.array.isRequired

  getDefaultProps: ->
    group: 'default'
    related_content: []

  getPossibleGroups: ->
    _.keys(RULES)

  buildLabel: (related) ->
    chapterSection = @sectionFormat(related.chapter_section, @props.sectionSeparator)
    "Review - #{chapterSection} #{related.title}"

  getGroupLabel: (group, related_content) ->

    if RULES[group].label?
      labels = RULES[group].label
    else
      labels = _.map(related_content, @buildLabel)

    labels

  render: ->
    {group, related_content, exercise_uid} = @props
    groupDOM = []

    if RULES[group].show
      className = group.replace(' ', '_')
      labels = @getGroupLabel(group, related_content)

      groupDOM = [<i className="icon-sm icon-#{className}" key='group-icon'></i>
        <span className='openstax-step-group-label' key='group-label'>{labels}</span>
      ]

    if exercise_uid
      groupDOM.push <ExerciseIdentifierLink key='exercise-uid' exerciseId={exercise_uid} />

    <div className='openstax-step-group'>
      {groupDOM}
    </div>

module.exports = ExerciseGroup
