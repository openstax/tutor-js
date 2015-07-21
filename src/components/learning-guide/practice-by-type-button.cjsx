React = require 'react'
BS = require 'react-bootstrap'
S = require '../../helpers/string'
_ = require 'underscore'

LearningGuide = require '../../flux/learning-guide'

module.exports = React.createClass
  propTypes:
    courseId: React.PropTypes.string.isRequired
    practiceType: React.PropTypes.string.isRequired
    practiceTitle: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  onClick: ->
    {courseId} = @props
    all = LearningGuide.Student.store.getSortedSections(@props.courseId)
    sections = if @props.practiceType is 'weaker' then _.first(all, 4) else _.last(all, 4)
    page_ids = _.chain(sections).pluck('page_ids').flatten().uniq().value()
    @context.router.transitionTo('viewPractice', {courseId}, {page_ids})

  render: ->
    <BS.Button className={@props.practiceType} onClick={@onClick}>
      {S.capitalize(@props.practiceTitle)}
      <i />
    </BS.Button>
