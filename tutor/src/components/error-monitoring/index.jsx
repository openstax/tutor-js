import { React, PropTypes, action, inject, observer, withRouter } from 'vendor';
import ErrorHandlers from './handlers';
import Course  from '../../models/course';
import { AppStore } from '../../flux/app';
import Dialog from '../tutor-dialog';

export default
@withRouter
@inject('courseContext')
@observer
class ServerErrorMonitoring extends React.Component {

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
    courseContext: PropTypes.shape({
      course: PropTypes.instanceOf(Course),
    }),
  }

  componentDidMount() {
    AppStore.on('server-error', this.onErrorChange);
  }

  componentWillUnmount() {
    AppStore.off('server-error', this.onErrorChange);
  }

  @action.bound onErrorChange() {
    const error = AppStore.getError();
    if (error) {

      const dialogAttrs = ErrorHandlers.forError(
        error, {
          history: this.props.history,
          course: this.props.courseContext.course,
        }
      );
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
