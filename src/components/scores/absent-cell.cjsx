React    = require 'react'

module.exports = React.createClass
  displayName: 'AbsentCell'

  render: ->
    <div className="cc-cell">
      <div className="score">---</div>
      <div className="worked">---</div>
    </div>
