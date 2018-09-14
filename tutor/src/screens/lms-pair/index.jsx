import { React, observer, cn, observable } from '../../helpers/react';
import './styles.scss';
import UX from './ux';

@observer
export default class LmsPairWrapper extends React.PureComponent {

  static propTypes = {
    ux: React.PropTypes.instanceOf(UX).isRequired,
  }

  static childContextTypes = {
    router: React.PropTypes.object,
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
}
