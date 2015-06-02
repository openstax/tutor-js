React = require 'react'

module.exports = React.createClass
  displayName: 'RefreshButton'

  render: ->
    # Wrap text in quotes so whitespace is preserved
    # and button is not right next to text.
    <span className='refresh-button'>
      {'There was a problem loading. '}
      <a className='btn btn-primary' href={window.location.href}>Refresh</a>
      {' to try again.'}
    </span>
