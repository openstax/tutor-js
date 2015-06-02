React = require 'react'

module.exports = React.createClass
  displayName: 'RefreshButton'

  render: ->
    <a className='btn btn-default refresh-button' href={window.location.href}>Refresh Page</a>
