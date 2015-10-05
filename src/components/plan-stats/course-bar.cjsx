React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'

CourseBar = React.createClass
  displayName: 'CourseBar'
  propTypes:
    data: React.PropTypes.object.isRequired
    type: React.PropTypes.string.isRequired
    totalCols: React.PropTypes.number
  getDefaultProps: ->
    totalCols: 12

  getStats: ->
    {data, type} = @props

    completeLabel = 'Complete'
    inProgressLabel = 'In Progress'
    notStartedLabel = 'Not Started'

    stats = [{
        type: 'complete'
        label: completeLabel
        value: data.complete_count
      }, {
        type: 'in-progress'
        label: inProgressLabel
        value: data.partially_complete_count
      }, {
        type: 'not-started'
        label: notStartedLabel
        value: data.total_count - (data.complete_count + data.partially_complete_count)
    }]

    if type is 'external'
      completeLabel = 'Clicked'
      inProgressLabel = 'Viewed'

      stats = [{
          type: 'complete'
          label: completeLabel
          value: data.complete_count
        }, {
          type: 'not-started'
          label: notStartedLabel
          value: data.total_count - (data.complete_count + data.partially_complete_count)
      }]

    if type is 'homework' and data.mean_grade_percent
      stats.unshift(
        type: 'average'
        label: 'Average'
        value: "#{data.mean_grade_percent}%"
      )

    stats

  renderCourseStat: (stat, cols = 4) ->
    key = "reading-stats-#{stat.type}"
    <BS.Col xs={cols} className={key} key={key}>
      <label>{stat.label}</label>
      <div className = "data-container-value text-#{stat.type}">
        {stat.value}
      </div>
    </BS.Col>

  render: ->
    {totalCols} = @props
    stats = @getStats()

    cols = totalCols / stats.length
    statsColumns = _.map stats, _.partial(@renderCourseStat, _, cols)

    <BS.Grid className='data-container' key='course-bar'>
      <BS.Row>
        {statsColumns}
      </BS.Row>
    </BS.Grid>

module.exports = CourseBar
