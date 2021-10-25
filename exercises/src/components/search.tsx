import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Preview from './exercise/preview';
import BookSections from './search/book-sections';
import BookTag from './search/book-tag';
import { Pagination } from './search/pagination'
import Clause from './search/clause';
import Controls from './search/controls';
import { observer, inject } from 'mobx-react';
import { IReactionDisposer, observable } from 'mobx';
import Loading from 'shared/components/loading-animation';
import { modelize, action, autorun } from 'shared/model';
import UX from '../ux';
import { Box } from 'boxible'
import { Row, Col } from 'react-bootstrap'
import ReactSelect from 'react-select'


interface SearchProps {
    ux: UX
    history: any
}

const SearchWrapper = styled.div`
    .input-group-prepend .btn,
    .input-group-append .btn {
        z-index: 0;
    }
`

const Select = styled(ReactSelect)`
    flex: 1;
    z-index: 4;
`

@inject('ux')
@observer
class Search extends React.Component<SearchProps> {
    static Controls = Controls;

    @observable selectedOption = 'section'
    options = [
        { value: 'section', label: 'section' },
        { value: 'tag', label: 'tag' },
    ]

    static propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,
        history: PropTypes.shape({
            push: PropTypes.func.isRequired,
        }).isRequired,
    };

    titleChangeDisposer: IReactionDisposer

    constructor(props: SearchProps) {
        super(props);
        modelize(this);
        this.titleChangeDisposer = autorun(() => {
            document.title = this.search.title
        })
        props.ux.setSearchDefault(props.history.location.search.replace(/^\?/, ''))
    }

    componentWillUnmount() {
        this.titleChangeDisposer()
        document.title = 'OpenStax Exercises'
    }

    get search() {
        return this.props.ux.search;
    }

    @action.bound onEdit(ev: React.MouseEvent<HTMLAnchorElement>) {
        ev.preventDefault();
        this.props.history.push(ev.currentTarget.pathname);
    }

    @action.bound onChangeOption(ev: { value: string, label: string }) {
        this.selectedOption = ev.value
        this.search.reset()
    }

    get body() {
        if (this.search.isPending) {
            return <Loading message="Searching…" />
        }
        if (this.search.api.hasBeenFetched && this.search.exercises.length == 0) {
            return <h3 className="mt-4 text-center">No exercises found</h3>
        }

        return this.search.exercises.map((e) => <Preview key={e.uuid} exercise={e} showEdit />);
    }

    searchOption() {
        return this.selectedOption == 'tag' ?
            <BookTag search={this.search} /> :
            <BookSections search={this.search} />
    }

    render() {
        return (
            <SearchWrapper className="panel search">
                <Row className="book-limit">
                    <Col xs={8}>
                        <Box align="center" gap margin="bottom">
                            <b>Limit results to book</b>
                            <Select
                                value={this.options.find(o => o.value === this.selectedOption)}
                                defaultValue={this.options[0]}
                                options={this.options}
                                onChange={this.onChangeOption}
                            />
                            {this.searchOption()}
                        </Box>
                    </Col>
                </Row>
                {this.search.clauses.map((c, i) => <Clause key={i} clause={c} />)}
                <Pagination search={this.search} />
                {this.body}
            </SearchWrapper>
        );
    }
}

export default Search;
