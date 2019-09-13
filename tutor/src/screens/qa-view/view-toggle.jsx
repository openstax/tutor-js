import { React, observer, PropTypes } from '../../helpers/react';
import Switch from 'react-bootstrap-switch';


export default
@observer
class ViewToggle extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
  }

  render() {
    const { ux } = this.props;

    return (
      <Switch
        onText="Exercises"
        offText="Book"
        offColor="primary"
        value={ux.isDisplayingExercises}
        onChange={ux.setDisplayingCard}
      />

    );
  }

}
