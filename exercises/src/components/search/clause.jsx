import PropTypes from 'prop-types';
import React from 'react';
import {
    Row, Col, InputGroup, DropdownButton, FormControl, Dropdown,
} from 'react-bootstrap';
import AsyncButton from 'shared/components/buttons/async-button';
import { observer } from 'mobx-react';

@observer
export default
class Clause extends React.Component {

    static propTypes = {
        clause: PropTypes.object.isRequired,
    };

    render() {
        const { clause } = this.props;
        let input;
        switch(clause.filter) {
          case 'format':
            const formatOptions = [];
            for (const eventKey in clause.formatFilters) {
              formatOptions.push(
                <Dropdown.Item eventKey={eventKey}>{clause.formatFilters[eventKey]}</Dropdown.Item>
              );
            }
            input = (
              <DropdownButton
                  variant="outline-primary"
                  title={clause.formatFilters[clause.value]}
                  onSelect={clause.setValue}
                  id="input-dropdown"
              >{formatOptions}</DropdownButton>
            );
            break;
          case 'solutions_are_public':
            const tfOptions = [];
            for (const eventKey in clause.tfFilters) {
              tfOptions.push(
                <Dropdown.Item eventKey={eventKey}>{clause.tfFilters[eventKey]}</Dropdown.Item>
              );
            }
            input = (
              <DropdownButton
                  variant="outline-primary"
                  title={clause.tfFilters[clause.value]}
                  onSelect={clause.setValue}
                  id="input-dropdown"
              >{tfOptions}</DropdownButton>
            );
            break;
          default:
            input = (
              <FormControl
                  type="text"
                  autoFocus
                  onKeyDown={clause.onKey}
                  onChange={clause.onChange}
                  value={clause.value}
              />
            );
        }

        return (
            <Row className="search-filter">
                <Col xs={8}>
                    <InputGroup>
                        <DropdownButton
                            as={InputGroup.Prepend}
                            variant="outline-secondary"
                            title={clause.description}
                            onSelect={clause.setFilter}
                            id="input-dropdown-addon"
                        >
                            <Dropdown.Item eventKey="uid">ID (Number@Version)</Dropdown.Item>
                            <Dropdown.Item eventKey="content">Content</Dropdown.Item>
                            <Dropdown.Item eventKey="nickname">Nickname</Dropdown.Item>
                            <Dropdown.Item eventKey="tag">Tag</Dropdown.Item>
                            <Dropdown.Item eventKey="author">Author</Dropdown.Item>
                            <Dropdown.Item eventKey="copyright_holder">Copyright Holder</Dropdown.Item>
                            <Dropdown.Item eventKey="collaborator">Any Collaborator</Dropdown.Item>
                            <Dropdown.Item eventKey="format">Format</Dropdown.Item>
                            <Dropdown.Item eventKey="solutions_are_public">Solutions are public?</Dropdown.Item>
                        </DropdownButton>
                        {input}
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
