import { React, observer, PropTypes } from 'vendor';
import Switch from 'react-bootstrap-switch';


@observer
export default
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
