React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'
pluralize = require 'pluralize'

ChapterSectionType = require './chapter-section-type'

Statistics = React.createClass

  propTypes:
    section:  ChapterSectionType.isRequired

  render: ->
    <div className='statistics'>
      <ul className='clue visible-when-debugging'>
        { for key, value of @props.section.clue
          value = value.join(' ') if _.isArray(value)
          <li key={key}><strong>{key}</strong>: {value}</li>}
      </ul>
      <div className='amount-worked'>
        <span className='count'>
          {@props.section.clue.unique_learner_count}
          {pluralize(' students', @props.section.clue.unique_learner_count)}
          {' have worked '}
          {@props.section.questions_answered_count}
          {pluralize(' problems', @props.section.questions_answered_count)}
        </span>
      </div>
    </div>


module.exports = Statistics
