moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

CourseAddMenuMixin = require './add-menu-mixin'

CourseAdd = React.createClass
  displayName: 'CourseAdd'

  mixins: [CourseAddMenuMixin]

  getInitialState: ->
    positionLeft: 0
    positionTop: 0
    open: false

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

  render: ->
    style =
      left: @state.positionLeft
      top: @state.positionTop

    style['display'] = if @state.open then 'block' else 'none'

    <BS.DropdownMenu ref='menu' style={style}>
      {@renderAddActions()}
    </BS.DropdownMenu>

module.exports = CourseAdd
