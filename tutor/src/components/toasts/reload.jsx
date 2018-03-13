import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
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
          <span>Updates available</span>
          <Icon type="close" onClick={dismiss} />
        </div>
        <div className="body">
          <p>
            This page needs to be reloaded.
          </p>
          <AsyncButton
            isWaiting={this.isReloading}
            bsStyle="primary"
            waitingText="Reloading…"
            onClick={this.onReload}
          >
            Reload
          </AsyncButton>
        </div>

      </div>
    );
  }

}

export default ReloadToast;
