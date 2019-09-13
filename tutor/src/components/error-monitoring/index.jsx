import { React, action, observer } from '../../helpers/react';
import ErrorHandlers from './handlers';
import { isReloaded } from '../../helpers/reload';
import { AppStore } from '../../flux/app';
import Dialog from '../tutor-dialog';

export default
@observer
class ServerErrorMonitoring extends React.Component {

  componentDidMount() {
    AppStore.on('server-error', this.onErrorChange);
  }

  componentWillUnmount() {
    AppStore.off('server-error', this.onErrorChange);
  }

  @action.bound onErrorChange() {
    const error = AppStore.getError();
    if (error && !isReloaded()) {
      const dialogAttrs = ErrorHandlers.forError(error, this.context);
      if (dialogAttrs) {
        Dialog.show( dialogAttrs ).then(dialogAttrs.onOk, dialogAttrs.onCancel);
      }
    }
  }

  render() {
    // We don't actually render anything
    return null;
  }
}
