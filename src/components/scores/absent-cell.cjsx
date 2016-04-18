React    = require 'react'

module.exports = React.createClass
  displayName: 'AbsentCell'

  render: ->
    <div className="cc-cell">
      <div className="score not-started">---</div>
      <div className="worked not-started">---</div>
    </div>
