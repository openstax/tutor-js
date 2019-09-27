import {
  React, PropTypes, observable, action, observer,
} from 'vendor';
import { AsyncButton } from 'shared';
import InfoIcon from '../../../components/icons/info';

@observer
class SetTimeAsDefault extends React.Component {

  static propTypes = {
    type: PropTypes.oneOf(['due', 'opens']).isRequired,
    tasking: PropTypes.object.isRequired,
  };

  @action.bound async setDefaultTime() {
    const { type, tasking } = this.props;
    this.isWaiting = true;
    await tasking.persistTime(type);
    this.isWaiting = false;
  }

  @observable isWaiting = false;

  render() {
    const { props: { type, tasking }, isWaiting } = this;
    if (!isWaiting) {
      if (type == 'due' && tasking.isUsingDefaultDueAt){
        return null;
      }
      if (type == 'opens' && tasking.isUsingDefaultOpensAt){
        return null;
      }
    }

    return (
      <AsyncButton
        variant="link"
        className="tasking-time-default"
        isWaiting={isWaiting}
        waitingText="Saving…"
        onClick={this.setDefaultTime}
      >
        Set as default
        <InfoIcon
          tooltipProps={{ placement: 'top' }}
          tooltip={`${type} times for assignments created from now on will have this time set as the default.`}
        />
      </AsyncButton>
    );
  }
}

export default SetTimeAsDefault;
