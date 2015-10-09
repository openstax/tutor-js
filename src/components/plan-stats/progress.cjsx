React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'

ChapterSectionMixin = require '../chapter-section-mixin'

Progress = React.createClass
  displayName: 'Progress'
  propTypes:
    data: React.PropTypes.object.isRequired
    type: React.PropTypes.string.isRequired
    activeSection: React.PropTypes.string
  mixins: [ChapterSectionMixin]

  _calculatePercent: (num, total) ->
    Math.round((num / total) * 100)

  calculatePercent: (data, correctOrIncorrect) ->
    correctOrIncorrect ?= 'correct'
    count = correctOrIncorrect + '_count'

    total_count = data.correct_count + data.incorrect_count
    if total_count then @_calculatePercent(data[count], total_count) else 0

  renderPercentBar: (data, type, percent, correctOrIncorrect) ->
    classes = 'reading-progress-bar'
    classes += " progress-bar-#{correctOrIncorrect}"
    classes += ' no-progress' unless percent

    label = "#{percent}%"
    label = "#{label} #{correctOrIncorrect}" if percent is 100

    correct = <BS.ProgressBar
                className={classes}
                label={label}
                now={percent}
                key="page-progress-#{type}-#{data.id}-#{correctOrIncorrect}"
                type="#{correctOrIncorrect}"
                alt="#{percent}% #{correctOrIncorrect}"/>

  renderPercentBars: ->
    {data, type} = @props

    percents =
      correct: @calculatePercent(data, 'correct')
      incorrect: @calculatePercent(data, 'incorrect')

    # make sure percents add up to 100
    if percents.incorrect + percents.correct > 100
      percents.incorrect = 100 - percents.correct

    _.map percents, _.partial(@renderPercentBar, data, type)

  render: ->
    {data, type, index, previous, activeSection} = @props

    studentCount = <span className='reading-progress-student-count'>
        ({data.student_count} students)
      </span>

    sectionLabel = @sectionFormat(data.chapter_section, @props.sectionSeparator)

    active = activeSection is sectionLabel

    progressClass = classnames 'reading-progress',
      'active': active
      'inactive': activeSection and not active

    <div key="#{type}-bar-#{index}" className={progressClass}>
      <div className='reading-progress-heading'>
        <strong>
          <span className='text-success'>
            {sectionLabel}
          </span> {data.title}
        </strong> {studentCount}
      </div>
      <div className='reading-progress-container'>
        <BS.ProgressBar className='reading-progress-group'>
          {@renderPercentBars()}
        </BS.ProgressBar>
        {previous}
      </div>
    </div>

module.exports = Progress
