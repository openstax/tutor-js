React = require 'react'

BackgroundAndDesk = React.createClass
  displayName: 'BackgroundAndDesk'
  propTypes:
    height: React.PropTypes.number.isRequired
  render: ->
    <div className='launcher-background'>
      <h1>Study Smarter with OpenStax Concept Coach</h1>
    </div>

module.exports = BackgroundAndDesk
