import { React, observer } from '../../helpers/react';
import Wizard from '../new-course/wizard';

@observer
export default class NewOrExisting extends React.PureComponent {

  static propTypes = {
    ux: React.PropTypes.object.isRequired,
  }

  render() {
    const { ux } = this.props;

    return (
      <Wizard ux={ux.createCourseUX} />
    );

  }
}
