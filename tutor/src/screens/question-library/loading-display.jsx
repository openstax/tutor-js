import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { ExercisesMap } from '../../models/exercises';
import { Icon } from 'shared';

@observer
export default
class LoadingDisplay extends React.Component {

  static propTypes = {
    exercises: PropTypes.instanceOf(ExercisesMap),
  }

  render() {
    if (!this.props.exercises.api.isPending) { return null; }

    return (
      <div className="loading">
        <Icon type="spinner" spin={true} /> Loading …
      </div>
    );
  }
}
