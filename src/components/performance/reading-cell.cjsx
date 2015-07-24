React    = require 'react'
CellStatusMixin = require './cell-status-mixin'

STATUS =
  'completed':   'Complete'
  'in_progress': 'In progress'
  'not_started': 'Not started'

module.exports = React.createClass
  displayName: 'ReadingCell'
  mixins: [CellStatusMixin]

  render: ->
    @renderLink( message: STATUS[@props.task.status] )
