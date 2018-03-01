import React from 'react';
import Switch from 'react-bootstrap-switch';
import { observer, propTypes as mobxPropTypes } from 'mobx-react';

@observer
export default class ViewToggle extends React.Component {

  static propTypes = {
    ux: mobxPropTypes.observableObject.isRequired,
  }

  render() {
    const { ux } = this.props;

    return (
      <Switch
        onText="Exercises"
        offText="Book"
        offColor="primary"
        value={ux.isDisplayingExercises}
        onChange={ux.setDisplayingPanel}
      />

    );
  }

}
