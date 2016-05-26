React = require 'react'

NoExercisesFound = React.createClass

  render: ->
    <div className="no-exercises">
      <h3>No exercises were found for the given sections or types.</h3>
      <p className="lead">Please select addtional sections and retry</p>
    </div>


module.exports = NoExercisesFound
