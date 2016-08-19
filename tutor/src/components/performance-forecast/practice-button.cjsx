React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

PerformanceForecast = require '../../flux/performance-forecast'
ChapterSectionType = require './chapter-section-type'

ButtonWithTip = require '../buttons/button-with-tip'
Practice = require './practice'

module.exports = React.createClass
  displayName: 'PracticeButton'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    title:    React.PropTypes.string.isRequired
    sections: React.PropTypes.arrayOf(ChapterSectionType)

  contextTypes:
    router: React.PropTypes.func

  getDefaultProps: ->
    id: _.uniqueId('practice-button-tooltip-')

  getTip: (props) ->
    'No problems are available for practicing' if props.isDisabled

  render: ->
    {sections, courseId, id} = @props
    page_ids = PerformanceForecast.Helpers.pagesForSections(sections)
    classes = classnames 'practice', @props.practiceType

    <Practice
      courseId={courseId}
      page_ids={page_ids}>
      <ButtonWithTip id={id} className={classes} getTip={@getTip} placement='top'>
        {@props.title}<i />
      </ButtonWithTip>
    </Practice>
