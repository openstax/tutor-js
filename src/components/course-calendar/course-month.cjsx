moment = require 'moment'
React = require 'react'
BS = require 'react-bootstrap'

{Calendar, Month, Week, Day} = require 'react-calendar'

CourseMonth = React.createClass
  displayName: 'CourseMonth'

  getInitialState: ->
    date: moment()

  handleNextMonth: (clickEvent) ->
    clickEvent.preventDefault()
    @setState(
      date: @state.date.clone().add(1, 'month')
    )

  handlePreviousMonth: (clickEvent) ->
    clickEvent.preventDefault()
    @setState(
      date: @state.date.clone().subtract(1, 'month')
    )

  render: ->

    # TODO see about doing a PR to the library after their react update to enable
    # modifying MonthHeader as a feature
    MonthHeader =
      <BS.Row className='month-header'>
        <BS.Col xs={4}>
          <a href="#" className='month-header-control previous' onClick={@handlePreviousMonth}><</a>
        </BS.Col>
        <BS.Col xs={4} className='month-header-label'>{@state.date.format('MMMM YYYY')}</BS.Col>
        <BS.Col xs={4}>
          <a href="#" className='month-header-control next' onClick={@handleNextMonth}>></a>
        </BS.Col>
      </BS.Row>


    <BS.Grid>
      {MonthHeader}
      <BS.Row>
        <BS.Col xs={12}>
          <Month date={@state.date}/>
        </BS.Col>
      </BS.Row>
    </BS.Grid>

module.exports = CourseMonth
