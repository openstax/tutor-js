import PropTypes from 'prop-types';
import React from 'react';
import {
  Row, Col, InputGroup, DropdownButton, FormControl, Dropdown,
} from 'react-bootstrap';
import AsyncButton from 'shared/components/buttons/async-button';
import { observer } from 'mobx-react';
import { action } from 'mobx';

export default
@observer
class Clause extends React.Component {

  static propTypes = {
    clause: PropTypes.object.isRequired,
  };

  @action.bound onSelect(key) {
    this.props.clause.filter = key;
  }


  render() {
    const { clause } = this.props;

    return (
      <Row>
        <Col xs={8}>
          <InputGroup>
            <DropdownButton
              as={InputGroup.Prepend}
              variant="outline-secondary"
              title={clause.description}
              onSelect={this.onSelect}
              id="input-dropdown-addon"
            >
              <Dropdown.Item eventKey="uid">ID (Number@Version)</Dropdown.Item>
              <Dropdown.Item eventKey="nickname">Nickname</Dropdown.Item>
              <Dropdown.Item eventKey="tag">Tag</Dropdown.Item>
              <Dropdown.Item eventKey="content">Content</Dropdown.Item>
              <Dropdown.Item eventKey="author">Author</Dropdown.Item>
              <Dropdown.Item eventKey="copyright_holder">Copyright Holder</Dropdown.Item>
              <Dropdown.Item eventKey="collaborator">Any Collaborator</Dropdown.Item>
            </DropdownButton>
            <FormControl
              type="text"
              autoFocus
              onKeyDown={clause.onKey}
              onChange={clause.setValue}
              value={clause.value}
            />
            <DropdownButton
              as={InputGroup.Append}
              variant="outline-secondary"
              title={`${clause.search.perPageSize} per page`}
              onSelect={clause.search.setPerPageSize}
            >
              <Dropdown.Item eventKey="25">25</Dropdown.Item>
              <Dropdown.Item eventKey="50">50</Dropdown.Item>
              <Dropdown.Item eventKey="75">75</Dropdown.Item>
              <Dropdown.Item eventKey="100">100</Dropdown.Item>
            </DropdownButton>
            <InputGroup.Append>

              <AsyncButton
                isWaiting={clause.search.api.isPending}
                waitingText="Searching…"
                onClick={clause.search.execute}
              >
                Go
              </AsyncButton>

            </InputGroup.Append>
          </InputGroup>

        </Col>
      </Row>
    );

  }

}
