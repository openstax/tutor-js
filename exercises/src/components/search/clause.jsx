import PropTypes from 'prop-types';
import React from 'react';
import {
    Row, Col, InputGroup, DropdownButton, FormControl, Dropdown,
} from 'react-bootstrap';
import AsyncButton from 'shared/components/buttons/async-button';
import { computed, observer } from 'shared/model';

@observer
export default
class Clause extends React.Component {

    static formatFilters = {
        'multiple-choice': 'Multiple Choice',
        'free-response': 'Free Response',
        'true-false': 'True or False',
    };

    static tfFilters = {
        'true': 'True',
        'false': 'False',
    };

    static propTypes = {
        clause: PropTypes.object.isRequired,
    };

    @computed get input() {
        const { clause } = this.props;

        if (clause.filter === 'format') {
            const formatOptions = [];
            for (const eventKey in Clause.formatFilters) {
                formatOptions.push(
                    <Dropdown.Item eventKey={eventKey}>{Clause.formatFilters[eventKey]}</Dropdown.Item>
                );
            }
            return (
                <DropdownButton
                    variant="outline-primary"
                    title={Clause.formatFilters[clause.value]}
                    onSelect={clause.setValue}
                    id="input-dropdown"
                >{formatOptions}</DropdownButton>
            );
        } else if (clause.filter === 'solutions_are_public') {
            const tfOptions = [];
            for (const eventKey in Clause.tfFilters) {
                tfOptions.push(
                    <Dropdown.Item eventKey={eventKey}>{Clause.tfFilters[eventKey]}</Dropdown.Item>
                );
            }
            return (
                <DropdownButton
                    variant="outline-primary"
                    title={Clause.tfFilters[clause.value]}
                    onSelect={clause.setValue}
                    id="input-dropdown"
                >{tfOptions}</DropdownButton>
            );
        } else {
            return (
                <FormControl
                    type="text"
                    autoFocus
                    onKeyDown={clause.onKey}
                    onChange={clause.onChange}
                    value={clause.value}
                />
            );
        }
    }

    render() {
        const { clause } = this.props;

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
                        {this.input}
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
