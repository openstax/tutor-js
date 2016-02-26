React = require 'react'

{ExerciseStore} = require '../../flux/exercise'
BindStore = require '../bind-store-mixin'
Icon = require '../icon'

LoadingDisplay = React.createClass

  componentWillMount:   -> ExerciseStore.onAny(@update)
  componentWillUnmount: -> ExerciseStore.offAny(@update)
  update: -> @forceUpdate()

  render: ->
    return null unless ExerciseStore.isLoading()
    <div className="loading">
      <Icon type="spinner" spin /> Loading …
    </div>

module.exports = LoadingDisplay
