React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'

Progress = require './progress'

ChaptersPerformance = React.createClass
  displayName: 'ChaptersPerformance'
  propTypes:
    currentPages: React.PropTypes.array.isRequired
    activeSection: React.PropTypes.string

  render: ->
    {currentPages, activeSection} = @props

    unless _.isEmpty(currentPages)
      chapters = _.map(currentPages, (data, i) ->
        <Progress data={data} type='chapter' index={i} activeSection={activeSection}/>
      )
      chapters = <section>
        <label>Current Topics Performance</label>
        {chapters}
      </section>

    chapters or null

PracticesPerformance = React.createClass
  displayName: 'PracticesPerformance'
  propTypes:
    spacedPages: React.PropTypes.array.isRequired
    activeSection: React.PropTypes.string

  calculatePercentDelta: (a, b) ->
    if a > b
      change = a - b
      op = '+'
    else if a is b
      change = 0
      op = ''
    else
      change = b - a
      op = '-'
    op + ' ' + Math.round((change / b) * 100)

  renderPracticeBars: (data, i) ->
    {activeSection} = @props

    if data.previous_attempt
      previous =
        <div className='reading-progress-delta'>
          {@calculatePercentDelta(data.correct_count, data.previous_attempt.correct_count)}% change
        </div>
    <Progress
      data={data}
      type='practice'
      index={i}
      previous={previous}
      activeSection={activeSection}/>

  render: ->
    {spacedPages} = @props

    unless _.isEmpty(spacedPages)
      practices = _.map(spacedPages, @renderPracticeBars)
      practices = <section>
        <label>Space Practice Performance</label>
        {practices}
      </section>

    practices or null

module.exports = {ChaptersPerformance, PracticesPerformance}
