React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

LearningGuide = require '../../flux/learning-guide'

module.exports = React.createClass
  displayName: 'PracticeByTypeButton'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    practiceType: React.PropTypes.string.isRequired
    practiceTitle: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  onClick: ->
    {courseId} = @props
    page_ids = LearningGuide.Student.store.getPracticePages(@props.courseId, @props.practiceType)
    unless _.isEmpty(page_ids)
      @context.router.transitionTo('viewPractice', {courseId}, {page_ids})

  render: ->
    page_ids = LearningGuide.Student.store.getPracticePages(@props.courseId, @props.practiceType)
    classNames = ['practice', @props.practiceType]
    isDisabled = _.isEmpty(page_ids)
    classNames.push 'disabled' if isDisabled

    button = <BS.Button className={classNames.join(' ')} onClick={@onClick}>
      {@props.practiceTitle}
      <i />
    </BS.Button>

    if isDisabled
      tooltip = <BS.Tooltip>No problems are available for practicing</BS.Tooltip>
      <BS.OverlayTrigger placement='top' overlay={tooltip}>
        {button}
      </BS.OverlayTrigger>
    else
      button
