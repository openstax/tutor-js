import { React, PropTypes, inject, observer, withRouter } from 'vendor';
import ErrorHandlers from './handlers';
import { Course, currentErrors } from '../../models';
import Dialog from '../tutor-dialog';
import { autorun } from 'mobx'


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

    componentDidMount() {
        this.stopErrorMonitor = autorun(this.displayErrors)
    }

    componentWillUnmount() {
        this.stopErrorMonitor()
    }


    displayErrors = () => {
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
    }

    render() {
        // We don't actually render anything, is only a component so it can
        // access context and start/stop observing on mount/unmount
        return null;
    }
}
