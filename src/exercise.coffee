React = require('react')
{Exercise} = require('./components')
config = require('./test')


randRange = (min, max) ->
  Math.floor(Math.random() * (max - min + 1)) + min

# Generate the variables
state = {}
for key, val of config.logic.inputs
  state[key] = randRange(val.start, val.end)

for key, val of config.logic.outputs
  val = val(state)
  try
    val = parseInt(val)
    # Inject commas
    val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  catch
    ''
  state[key] = val

# -------------------------------
# Generate the HTML

root = document.getElementById('exercise')
root.innerHTML = ''
React.renderComponent(Exercise({config, state}), root)
