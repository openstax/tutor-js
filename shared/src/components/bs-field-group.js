import React from 'react';
import BS from 'react-bootstrap';
import omit from 'lodash/omit';

const BSFieldGroup = function(props) {
  const { id, label, help } = props;

  let control =
    <BS.FormControl
      {...omit(props,
        'id', 'label', 'help', 'buttonBefore', 'buttonAfter'
      )} />;

  if (props.buttonAfter || props.buttonBefore) {
    control =
      <BS.InputGroup>
        {props.buttonBefore}
        {control}
        {props.buttonAfter}
      </BS.InputGroup>;
  }

  return (
    <BS.FormGroup controlId={id}>
      <BS.ControlLabel>
        {label}
      </BS.ControlLabel>
      {control}
      {help && <BS.HelpBlock>
        {help}
      </BS.HelpBlock>}
    </BS.FormGroup>
  );
};


export default BSFieldGroup;
