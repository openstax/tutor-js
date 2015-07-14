React = require 'react'

TutorRequired = React.createClass
  render: ->
    <div className='hint required-hint'>
      Required Field <i className='fa fa-exclamation-circle'></i>
    </div>

TutorUrl = React.createClass
  render: ->
    <div className='hint'>
      Please type in a url.
    </div>

module.exports =
  required: TutorRequired
  url: TutorUrl
