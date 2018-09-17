import React from 'react';
import {
  Row, Col, FormGroup, InputGroup, Dropdown, Button,
  FormControl, DropdownButton, MenuItem,
} from 'react-bootstrap';
import AsyncButton from 'shared/components/buttons/async-button.cjsx';
import { observer } from 'mobx-react';

@observer
export default class Clause extends React.Component {

  static propTypes = {
    clause: React.PropTypes.object.isRequired,
  };

  render() {
    const { clause } = this.props;

    return (
      <Row>
        <Col xs={8}>
          <FormGroup>
            <InputGroup>
              <DropdownButton
                title={clause.description}
                componentClass={InputGroup.Button}
                onSelect={clause.onSelect}
                id="input-dropdown-addon"
              >
                <MenuItem eventKey="id">ID (Number@Version)</MenuItem>
                <MenuItem eventKey="nickname">Nickname</MenuItem>
                <MenuItem eventKey="tag">Tag</MenuItem>
                <MenuItem eventKey="content">Content</MenuItem>
                <MenuItem eventKey="author">Author</MenuItem>
                <MenuItem eventKey="copyright_holder">Copyright Holder</MenuItem>
                <MenuItem eventKey="collaborator">Any Collaborator</MenuItem>
              </DropdownButton>
              <FormControl
                type="text"
                autoFocus
                onKeyDown={clause.onKey}
                onChange={clause.setValue}
                value={clause.value}
              />
              <InputGroup.Button>
                <AsyncButton
                  isWaiting={clause.search.api.isPending}
                  waitingText="Searching…"
                  onClick={clause.search.execute}
                >
                  Go
                </AsyncButton>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Col>
      </Row>
    );

  }

}
