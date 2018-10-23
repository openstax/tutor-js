import PropTypes from 'prop-types';
import { React, observer, cn, observable } from '../../helpers/react';
import './styles.scss';
import UX from './ux';

export default
@observer
class LmsPairWrapper extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  }

  static childContextTypes = {
    router: PropTypes.object,
  }

  getChildContext() {
    return { router: this.props.ux.router };
  }

  render() {
    const { ux, ux: { panel: Panel } } = this.props;

    return (
      <div className="new-course-wizard">
        <Panel {...ux.props} />
      </div>
    );
  }
};
