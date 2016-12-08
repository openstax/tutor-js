React = require 'react'

TutorRequired = React.createClass
  render: ->
    <div className='hint required-hint'>
      Required field
    </div>

TutorUrl = React.createClass
  render: ->
    <div className='hint'>
      Please type in a url.
    </div>

TutorPeriodNameExists = React.createClass
  render: ->
    <div className='hint'>
      Name already exists.
    </div>

TutorTimeIncorrectFormat = React.createClass
  render: ->
    <div className='hint'>
      Please type a time.
    </div>

module.exports =
  required: TutorRequired
  url: TutorUrl
  periodNameExists: TutorPeriodNameExists
  incorrectTime: TutorTimeIncorrectFormat
