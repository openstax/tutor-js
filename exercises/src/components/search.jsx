import React from 'react';
import cn from 'classnames';
import {
  Row, Col, FormGroup, InputGroup, Dropdown, Button,
  FormControl, DropdownButton, MenuItem,
} from 'react-bootstrap';
import Preview from './search/preview';
import Clause from './search/clause';
import Controls from './search/controls';
import { observer, inject } from 'mobx-react';
import UX from '../ux';

@inject('ux')
@observer
class Search extends React.Component {

  static Controls = Controls;

  static propTypes = {
    ux: React.PropTypes.instanceOf(UX).isRequired,
  };

  get search() {
    return this.props.ux.search;
  }

  render() {

    const { clauses, exercises } = this.search;

    return (
      <div className="search">
        {clauses.map((c, i) => <Clause key={i} clause={c} />)}
        {exercises.map((e) => <Preview key={e.uuid} exercise={e} />)}
      </div>
    );
  }
}

export default Search;
