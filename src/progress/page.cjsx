React = require 'react'
_ = require 'underscore'
moment = require 'moment'
classnames = require 'classnames'

navigation = require '../navigation/model'

{ChapterSectionMixin, ResizeListenerMixin} = require 'openstax-react-components'
{ExerciseProgress} = require './exercise'

PageProgress = React.createClass
  displayName: 'PageProgress'
  getDefaultProps: ->
    page: {}
    dateFormat: 'MMM. D'
    progressWidth: 30
    progressMargin: 5
    dateBuffer: 100
  mixins: [ChapterSectionMixin, ResizeListenerMixin]
  switchModule: (data) ->
    navigation.channel.emit('switch.module', {data, view: 'task'})
  render: ->
    {page, dateFormat, dateBuffer, maxLength, progressWidth, progressMargin, className} = @props
    {componentEl} = @state

    exercisesProgressWidth = maxLength * progressWidth + (maxLength - 1) * progressMargin
    titleWidth = componentEl.width - exercisesProgressWidth - dateBuffer

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

    <li className={classes} onClick={_.partial(@switchModule, {moduleUUID: page.uuid})}>
      <h4 className='concept-coach-progress-page-title' style={width: titleWidth}>
        <div {...sectionProps}>
          {page.title}
        </div>
      </h4>
      <span className='concept-coach-progress-page-last-worked'>{pageLastWorked}</span>
      <div
        style={width: exercisesProgressWidth}
        className='concept-coach-progress-exercises'>
        {exercises}
      </div>
    </li>

module.exports = {PageProgress}
