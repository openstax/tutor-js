import { React, PropTypes, observer } from 'vendor';
import UX from './ux';
import Instructions from './step/instructions';
import withFooter from './with-footer';

@observer
class ExternalTaskStep extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  }

  onContextMenu(ev) {
    return ev.preventDefault();
  }

  render() {
    const { ux } = this.props;

    return (
      <Instructions ux={ux} />
    );
  }
}

export default withFooter(ExternalTaskStep);
