import PropTypes from 'prop-types';
import React from 'react';
import Preview from './exercise/preview';
import Clause from './search/clause';
import Controls from './search/controls';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';
import UX from '../ux';

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

  get search() {
    return this.props.ux.search;
  }

  @action.bound onEdit(ev) {
    ev.preventDefault();
    this.props.history.push(ev.currentTarget.pathname);
  }

  render() {

    const { clauses, exercises } = this.search;

    return (
      <div className="search">
        {clauses.map((c, i) => <Clause key={i} clause={c} />)}
        {exercises.map((e) => (
          <Preview key={e.uuid} exercise={e} showEdit />
        ))}
      </div>
    );
  }
}

export default Search;
