React = require 'react'
BS    = require 'react-bootstrap'
omit  = require 'lodash/omit'

BSFieldGroup = (props) ->
  { id, label, help } = props

  control =
    <BS.FormControl {...(omit(props,
      'id', 'label', 'help', 'buttonBefore', 'buttonAfter'
      ))} />

  if props.buttonAfter or props.buttonBefore
    control =
      <BS.InputGroup>
        {props.buttonBefore}
        {control}
        {props.buttonAfter}
      </BS.InputGroup>

  <BS.FormGroup controlId={id}>
    <BS.ControlLabel>{label}</BS.ControlLabel>
    {control}
    {help and <BS.HelpBlock>{help}</BS.HelpBlock>}
  </BS.FormGroup>


module.exports = BSFieldGroup
