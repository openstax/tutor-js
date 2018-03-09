import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import TutorBranding from '../branding/course';
import { forceReload } from '../../helpers/reload';
import Icon from '../icon';
import { AsyncButton } from 'shared';

@observer
class ReloadToast extends React.Component {

  static propTypes = {
    dismiss: React.PropTypes.func.isRequired,
  }

  @observable isReloading = false;

  @action.bound onReload() {
    this.isReloading = true;
    forceReload();
  }

  render() {
    const { dismiss } = this.props;

    return (
      <div className="toast reload">
        <div className="title">
          <span>Updates are available</span>
          <Icon type="close" onClick={dismiss} />
        </div>
        <div className="body">
          <p>
            Your copy of <TutorBranding /> is out of date.
            Please reload to update it.
          </p>
          <AsyncButton
            isWaiting={this.isReloading}
            bsStyle="primary"
            waitingText="Reloading…"
            onClick={this.onReload}
          >
            Reload now
          </AsyncButton>
        </div>

      </div>
    );
  }

}

export default ReloadToast;
