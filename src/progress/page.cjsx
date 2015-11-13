React = require 'react'
_ = require 'underscore'
moment = require 'moment'
classnames = require 'classnames'

{ChapterSectionMixin} = require 'openstax-react-components'
{ExerciseProgress} = require './exercise'

PageProgress = React.createClass
  displayName: 'PageProgress'
  getDefaultProps: ->
    page: {}
    dateFormat: 'MMM. D'
    progressWidth: 30
    progressMargin: 5
  mixins: [ChapterSectionMixin]
  render: ->
    {page, dateFormat, maxLength, progressWidth, progressMargin, className} = @props

    classes = classnames 'concept-coach-progress-page', className
    section = @sectionFormat(page.chapter_section)
    pageLastWorked = moment(page.last_worked_at).format(dateFormat)

    sectionProps =
      className: 'chapter-section-prefix'
    sectionProps['data-section'] = section if section?

    exercises = _.map page.exercises, (exercise) ->
      <ExerciseProgress
        exercise={exercise}
        key={"progress-exercise-#{exercise.id}"}/>

    exercisesProgressWidth = maxLength * progressWidth + (maxLength - 1) * progressMargin

    <li className={classes}>
      <h4 {...sectionProps}>
        {page.title}
      </h4>
      <span className='concept-coach-progress-page-last-worked'>{pageLastWorked}</span>
      <div
        style={width: exercisesProgressWidth}
        className='concept-coach-progress-exercises'>
        {exercises}
      </div>
    </li>

module.exports = {PageProgress}
