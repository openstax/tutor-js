React = require 'react'
BS = require 'react-bootstrap'
PracticeButtonMixin = require './practice-button-mixin'

PracticeButton = React.createClass
  displayName: 'PracticeButton'

  mixins: [PracticeButtonMixin]

  render: ->
    <BS.Button bsStyle='primary' className='-practice' onClick={@getOrCreatePractice}>
      {@props.children}
    </BS.Button>


module.exports = PracticeButton
