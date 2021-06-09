import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Preview from './exercise/preview';
import Clause from './search/clause';
import Controls from './search/controls';
import { observer, inject } from 'mobx-react';
import BSPagination from 'shared/components/pagination';
import Loading from 'shared/components/loading-animation';
import { modelize, action } from 'shared/model';
import UX from '../ux';
import pluralize from 'pluralize';
import { toSentence } from 'shared/helpers/string'

const Pagination = styled(BSPagination)`
  justify-content: center;
  margin-top: 2rem;
`;

const Title = ({ exercises, clauses }) => {
    if (!exercises.length) {
        return null;
    }
    return (
        <h6 className="search-title">{pluralize('exercise', exercises.length, true)} found for {toSentence(clauses.map(c => c.asString))}</h6>
    )
}

@inject('ux')
@observer
class Search extends React.Component {
    static Controls = Controls;

    static propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,
        history: PropTypes.shape({
            push: PropTypes.func.isRequired,
        }).isRequired,
    };

    constructor(props) {
        super(props);
        modelize(this);
    }

    get search() {
        return this.props.ux.search;
    }

    @action.bound onEdit(ev) {
        ev.preventDefault();
        this.props.history.push(ev.currentTarget.pathname);
    }

    render() {
        const { clauses, exercises, pagination, api } = this.search;
        const body = api.isPending ?
            <Loading message="Searching…" /> :
            exercises.map((e) => <Preview key={e.uuid} exercise={e} showEdit />);

        return (
            <div className="panel search">
                {clauses.map((c, i) => <Clause key={i} clause={c} />)}
                {pagination && <Pagination hideFirstAndLastPageLinks {...pagination} />}
                <Title clauses={clauses} exercises={exercises} />
                {body}
            </div>
        );
    }
}

export default Search;
