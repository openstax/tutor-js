React = require 'react'
camelCase = require 'camelcase'
_ = require 'underscore'

ChapterSectionMixin = require '../../chapter-section-mixin'

defaultGroup = {
  show: false
}

rules =
  default: defaultGroup
  core: defaultGroup
  personalized:
    show: true
    label: 'Personalized'
  #  TODO deprecate spaced practice when BE is updated
  'spaced practice':
    show: true

  spaced_practice:
    show: true

GroupRulesMixin =
  getPossibleGroups: ->
    _.keys(rules)

  buildLabel: (related) ->
    chapterSection = @sectionFormat(related.chapter_section, @props.sectionSeparator)
    "Review - #{chapterSection} #{related.title}"

  getGroupLabel: (group, related_content) ->

    if rules[group].label?
      labels = rules[group].label
    else
      labels = _.map(related_content, @buildLabel)

    labels

ExerciseGroup = React.createClass
  displayName: 'ExerciseGroup'
  mixins: [ChapterSectionMixin, GroupRulesMixin]

  propTypes:
    group: React.PropTypes.oneOf(_.keys(rules)).isRequired
    related_content: React.PropTypes.array.isRequired

  getDefaultProps: ->
    group: 'default'
    related_content: []

  render: ->
    {group, related_content} = @props
    groupDOM = null

    if rules[group].show
      className = group.replace(' ', '_')
      labels = @getGroupLabel(group, related_content)

      groupDOM = <div className='task-step-group'>
          <i className="icon-sm icon-#{className}"></i>
          <span className='task-step-group-label'>{labels}</span>
        </div>

    groupDOM

module.exports = ExerciseGroup
