React = require 'react'
TutorDialog = require '../tutor-dialog'

module.exports = (message) ->
  body =
    <div>
      <p className="lead">{message}</p>
    </div>
  TutorDialog.show({
    body, title: 'You have excluded exercises that have not been saved'
  })
