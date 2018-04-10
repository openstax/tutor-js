import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { forceReload } from '../../helpers/reload';
import Icon from '../icon';
import { AsyncButton } from 'shared';

@observer
class ReloadToast extends React.Component {

  @observable isReloading = false;

  @action.bound onReload() {
    this.isReloading = true;
    forceReload();
  }

  render() {
    return (
      <div className="toast reload">
        <div className="title">
          <span>Updates available</span>
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
