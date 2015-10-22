React = require 'react'

module.exports = React.createClass
  displayName: 'CardList'

  render: ->
    classes = ["row card-list"]
    classes.push(@props.className) if @props.className
    classes = classes.join(' ')
    
    <div className={classes}>
      <div className="col m5">
        {@props.children}
      </div>
    </div>
