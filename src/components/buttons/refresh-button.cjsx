React = require 'react'

module.exports = React.createClass
  displayName: 'RefreshButton'

  propTypes:
    beforeText: React.PropTypes.string
    buttonText: React.PropTypes.string
    afterText: React.PropTypes.string

  getDefaultProps: ->
    beforeText: 'There was a problem loading. '
    buttonText: 'Refresh'
    afterText: ' to try again.'

  render: ->
    {beforeText, buttonText, afterText} = @props

    # Wrap text in quotes so whitespace is preserved
    # and button is not right next to text.
    <span className='refresh-button'>
      {beforeText}
      <a className='btn btn-primary' href={window.location.href}>{buttonText}</a>
      {afterText}
    </span>
