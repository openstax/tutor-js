{ExerciseActions, ExerciseStore} = require 'stores/exercise'



module.exports = React.createClass
  displayName: 'ExerciseErrors'

  componentWillMount: ->
    ExerciseStore.on('change', @update)

  update: -> @forceUpdate()

  clearError: ->
    @setState(error: null)

  render: ->
    console.log 'render error'
    return null unless @state.error
    <BS.Alert bsStyle="danger" onDismiss={@clearError}>
      <p>{@state.error}</p>
    </BS.Alert>
