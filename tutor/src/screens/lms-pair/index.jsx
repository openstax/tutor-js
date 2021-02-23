import PropTypes from 'prop-types';
import { React, observer } from 'vendor';
import './styles.scss';
import UX from './ux';

@observer
export default
class LmsPairWrapper extends React.Component {
  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  }

  render() {
    const { ux, ux: { panel: Panel } } = this.props;

    return (
      <div className="new-course-wizard">
        <Panel {...ux.props} />
      </div>
    );
  }
}
