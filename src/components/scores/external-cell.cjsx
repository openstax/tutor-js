React    = require 'react'
CellStatusMixin = require './cell-status-mixin'

STATUS =
  'completed':   'Clicked'
  'in_progress': 'Viewed'
  'not_started': '---'

module.exports = React.createClass
  displayName: 'ExternalCell'
  mixins: [CellStatusMixin]

  render: ->
    <div className="external-cell">
      {@renderLink( message: STATUS[@props.task.status] )}
    </div>
