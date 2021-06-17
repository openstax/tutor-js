import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Preview from './exercise/preview';
import BookSections from './search/book-sections';
import Clause from './search/clause';
import Controls from './search/controls';
import { observer, inject } from 'mobx-react';
import type { IReactionDisposer } from 'mobx';
import BSPagination from 'shared/components/pagination';
import Loading from 'shared/components/loading-animation';
import { modelize, action, autorun } from 'shared/model';
import UX from '../ux';


const Pagination = styled(BSPagination)`
  justify-content: center;
  margin-top: 2rem;
`;


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

    render() {
        const { clauses, exercises, pagination, api } = this.search;
        const body = api.isPending ?
            <Loading message="Searching…" /> :
            exercises.map((e) => <Preview key={e.uuid} exercise={e} showEdit />);

        return (
            <SearchWrapper className="panel search">
                <BookSections search={this.search}/>
                {clauses.map((c, i) => <Clause key={i} clause={c} />)}
                {pagination && <Pagination hideFirstAndLastPageLinks {...pagination} />}
                {body}
            </SearchWrapper>
        );
    }
}

export default Search;
