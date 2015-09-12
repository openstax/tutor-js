React    = require 'react'
CellStatusMixin = require './cell-status-mixin'

STATUS =
  'completed':   'Clicked'
  'in_progress': 'Viewed'
  'not_started': 'Not started'

module.exports = React.createClass
  displayName: 'ExternalCell'
  mixins: [CellStatusMixin]

  render: ->
    @renderLink( message: STATUS[@props.task.status] )
