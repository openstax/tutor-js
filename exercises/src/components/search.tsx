import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Preview from './exercise/preview';
import BookSections from './search/book-sections';
import { Pagination } from './search/pagination'
import Clause from './search/clause';
import Controls from './search/controls';
import { inject } from 'mobx-react';
import { IReactionDisposer } from 'mobx';
import Loading from 'shared/components/loading-animation';
import { action, autorun, modelize, observer } from 'shared/model';
import UX from '../ux';
import { Box } from 'boxible'
import { Row, Col } from 'react-bootstrap'


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

@inject('ux')
@observer
class Search extends React.Component<SearchProps> {
    static Controls = Controls;

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

    get body() {
        if (this.search.isPending) {
            return <Loading message="Searching…" />
        }
        if (this.search.api.hasBeenFetched && this.search.exercises.length == 0) {
            return <h3 className="mt-4 text-center">No exercises found</h3>
        }

        return this.search.exercises.map((e) => <Preview key={e.uuid} exercise={e} showEdit />);
    }

    render() {
        return (
            <SearchWrapper className="panel search">
                <Row className="book-limit">
                    <Col xs={8}>
                        <Box align="center" gap margin="bottom">
                            <b>Limit results to (approved books)</b>
                            <BookSections search={this.search} />
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
