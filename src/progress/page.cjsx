React = require 'react'
_ = require 'underscore'
dateFormat = require 'dateformat'
classnames = require 'classnames'
EventEmitter2 = require 'eventemitter2'

{ChapterSectionMixin, ResizeListenerMixin} = require 'openstax-react-components'
{ExerciseProgress} = require './exercise'

PageProgress = React.createClass
  displayName: 'PageProgress'
  getDefaultProps: ->
    page: {}
    dateFormatString: 'mmm. d'
    progressWidth: 30
    progressMargin: 5
    dateBuffer: 100

  contextTypes:
    navigator: React.PropTypes.instanceOf(EventEmitter2)

  mixins: [ChapterSectionMixin, ResizeListenerMixin]
  switchModule: (data) ->
    @context.navigator.emit('switch.module', {data, view: 'task'})
  render: ->
    {page, dateFormatString, dateBuffer, maxLength, progressWidth, progressMargin, className} = @props
    {componentEl} = @state

    exercisesProgressWidth = maxLength * progressWidth + (maxLength - 1) * progressMargin
    titleWidth = componentEl.width - exercisesProgressWidth - dateBuffer

    classes = classnames 'concept-coach-progress-page', className
    section = @sectionFormat(page.chapter_section)
    pageLastWorked = dateFormat(new Date(page.last_worked_at), dateFormatString) if page.last_worked_at?

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
