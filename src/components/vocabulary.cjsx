React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'


Vocabulary = React.createClass
  propTypes:
    id:   React.PropTypes.string.isRequired


  render: ->
    <h1>Showing Vocab stuff</h1>


module.exports = Vocabulary
