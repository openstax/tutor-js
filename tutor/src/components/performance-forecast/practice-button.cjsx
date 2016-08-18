React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'

PerformanceForecast = require '../../flux/performance-forecast'
{CoursePracticeStore} = require '../../flux/practice'
ChapterSectionType = require './chapter-section-type'

module.exports = React.createClass
  displayName: 'PracticeButton'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    title:    React.PropTypes.string.isRequired
    sections: React.PropTypes.arrayOf(ChapterSectionType)
  contextTypes:
    router: React.PropTypes.func

  componentWillMount: ->
    uniqueId = _.uniqueId('practice-button-tooltip-')
    @setState({uniqueId: uniqueId})

  onClick: ->
    {courseId, sections} = @props
    page_ids = PerformanceForecast.Helpers.pagesForSections(sections)
    unless @isDisabled()
      @context.router.transitionTo('viewPractice', {courseId}, {page_ids})

  isDisabled: ->
    {sections, courseId} = @props
    page_ids = PerformanceForecast.Helpers.pagesForSections(sections)
    _.isEmpty(page_ids) or CoursePracticeStore.isDisabled(courseId, {page_ids})

  render: ->
    isDisabled = @isDisabled()
    classes = classnames 'practice', @props.practiceType,
      disabled: isDisabled

    button = <BS.Button className={classes} onClick={@onClick}>
      {@props.title}
      <i />
    </BS.Button>

    if isDisabled
      tooltip = <BS.Tooltip id={@state.uniqueId}>No problems are available for practicing</BS.Tooltip>
      <BS.OverlayTrigger placement='top' overlay={tooltip}>
        {button}
      </BS.OverlayTrigger>
    else
      button
