React    = require 'react'
_ = require 'underscore'

module.exports = React.createClass
  displayName: 'AbsentCell'

  findTypeFromColumn: ->
    {refs, columnIndex} = @props
    type = _.findWhere(_.keys(refs), columnIndex)
    type?.split('-').pop()

  render: ->
    columnType = @findTypeFromColumn()

    if columnType is 'reading' or columnType is 'external'
      <div className="scores-cell">
        <div className="worked not-started wide">---</div>
      </div>
    else
      <div className="scores-cell">
        <div className="score not-started">---</div>
        <div className="worked not-started">---</div>
      </div>
