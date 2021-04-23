import { React, PropTypes, inject, observer, withRouter } from 'vendor';
import ErrorHandlers from './handlers';
import { Course, currentErrors } from '../../models';
// import { AppStore } from '../../flux/app';
import Dialog from '../tutor-dialog';

@withRouter
@inject('courseContext')
@observer
export default
class ServerErrorMonitoring extends React.Component {
    static propTypes = {
        history: PropTypes.shape({
            push: PropTypes.func,
        }),
        courseContext: PropTypes.shape({
            course: PropTypes.instanceOf(Course),
        }),
    }

    // componentDidMount() {
    //     AppStore.on('server-error', this.onErrorChange);
    // }

    // componentWillUnmount() {
    //     AppStore.off('server-error', this.onErrorChange);
    // }
    render() {
        const error = currentErrors.latest

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
        // We don't actually render anything
        return null;
    }
}
