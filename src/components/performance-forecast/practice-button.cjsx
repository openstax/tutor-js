React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

PerformanceForecast = require '../../flux/performance-forecast'
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
    unless _.isEmpty(page_ids)
      @context.router.push("/courses/#{courseId}/practice", {page_ids})

  render: ->
    {sections} = @props
    page_ids = PerformanceForecast.Helpers.pagesForSections(sections)
    classNames = ['practice', @props.practiceType]
    isDisabled = _.isEmpty(page_ids)
    classNames.push 'disabled' if isDisabled

    button = <BS.Button className={classNames.join(' ')} onClick={@onClick}>
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
