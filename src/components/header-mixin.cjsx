React = require 'react'

module.exports =

  # renderFirstRow: ->
  # renderSecondRow: ->

  render: ->
    classes = ['double-height', 'green']
    classes.push(@props.className) if @props.className
    classes = classes.join(' ')

    <nav className={classes}>
      <div className="nav-wrapper">
        <div className="col s12 header-row-1">
          {@renderFirstRow()}
        </div>
        <div className="col s12 header-row-2">
          {@renderSecondRow()}
        </div>
      </div>
    </nav>
