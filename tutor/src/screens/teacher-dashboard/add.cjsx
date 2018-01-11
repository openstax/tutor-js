moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'
classnames = require 'classnames'

{TimeStore} = require '../../flux/time'
TimeHelper = require '../../helpers/time'

CourseAddMenuMixin = require './add-menu-mixin'

CourseAdd = React.createClass
  displayName: 'CourseAdd'

  propTypes:
    courseId:   React.PropTypes.string.isRequired
    termStart:  TimeHelper.PropTypes.moment
    termEnd:    TimeHelper.PropTypes.moment

  mixins: [CourseAddMenuMixin]

  getInitialState: ->
    positionLeft: 0
    positionTop: 0
    open: false
    referenceDate: moment(TimeStore.getNow())

  updateState: (date, x, y) ->
    @setState({
      addDate: date
      positionLeft: x
      positionTop: y
      open: true
    })

  close: ->
    @setState({
      addDate: null
      open: false
    })

  getDateType: ->
    {referenceDate, addDate} = @state
    {termStart, termEnd} = @props
    return null unless addDate?

    if addDate.isBefore(termStart, 'day')
      'day before term starts'
    else if addDate.isAfter(termEnd, 'day')
      'day after term ends'
    else if addDate.isBefore(referenceDate, 'day')
      'past day'

  render: ->
    {referenceDate, addDate, open} = @state

    # DYNAMIC_ADD_ON_CALENDAR_POSITIONING
    # Positions Add menu on date
    style =
      left: @state.positionLeft
      top: @state.positionTop

    style['display'] = if open then 'block' else 'none'

    addDateType = @getDateType()
    className = classnames 'course-add-dropdown',
      'no-add': addDateType

    # only allow add if addDate is on or after reference date
    if addDateType
      dropdownContent = <li>
        <span className='no-add-text'>Cannot assign to {addDateType}</span>
      </li>
    else
      dropdownContent = @renderAddActions()

    <BS.Dropdown.Menu
    id='course-add-dropdown'
    ref='addOnDayMenu'
    style={style}
    className={className}>
      {dropdownContent}
    </BS.Dropdown.Menu>

module.exports = CourseAdd
