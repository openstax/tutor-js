import { React, PropTypes } from '../../../helpers/react';
import { observer } from 'mobx-react';
import BuilderPopup from './builder-popup';

const VALID_PLAN_TYPES = ['reading', 'homework'];

export default
@observer
class PreviewButton extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
  }

  render() {
    const { ux } = this.props;

    if (!VALID_PLAN_TYPES.includes(ux.plan.type)) { return null; }

    return (
      <BuilderPopup course={ux.course} planType={ux.plan.type} />
    );
  }
}
