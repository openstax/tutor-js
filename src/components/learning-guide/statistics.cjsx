React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

{CurrentUserStore} = require '../../flux/current-user'

ChapterSectionType = require './chapter-section-type'
pluralize = require 'pluralize'
pluralize.addIrregularRule(' has', ' have')

Statistics = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    section:  ChapterSectionType.isRequired
    displaying: React.PropTypes.string.isRequired

  render: ->
    role = CurrentUserStore.getCourseRole(@props.courseId, true)
    count = @props.section.clue.unique_learner_count
    total = @props.section.questions_answered_count

    teacherWorkedText =
      "#{pluralize(' students', count, true)}
       #{pluralize(' has', count)} worked #{pluralize(' problems', total, true)}"

    studentWorkedText =
      "#{pluralize(' problems', total, true)} worked in this #{@props.displaying}"

    <div className='statistics'>
      <ul className='clue visible-when-debugging'>
        { for key, value of @props.section.clue
          value = value.join(' ') if _.isArray(value)
          <li key={key}><strong>{key}</strong>: {value}</li>}
      </ul>
      <div className='amount-worked'>
        <span className='count'>
          {if role is 'teacher' then teacherWorkedText else studentWorkedText}
        </span>
      </div>
    </div>


module.exports = Statistics
