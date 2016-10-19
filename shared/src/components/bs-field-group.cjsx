BS = require 'react-bootstrap'
omit = require 'lodash/omit'

BSFieldGroup = (props) ->
  { id, label, help } = props

  <BS.FormGroup controlId={id}>
    <BS.ControlLabel>{label}</BS.ControlLabel>
    <BS.FormControl {...(omit(props, 'id', 'label', 'help'))} />
    {help and <BS.HelpBlock>{help}</BS.HelpBlock>}
  </BS.FormGroup>


module.exports = BSFieldGroup
