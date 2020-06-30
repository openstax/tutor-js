import { React, PropTypes, observer } from 'vendor';
import UX from './ux';
import withFooter from './with-footer';
import Instructions from './step/instructions';

@observer
class EventTask extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  }

  render() {
    const { ux } = this.props;
    return (
      <Instructions ux={ux} />
    );
  }

}

export default withFooter(EventTask);
