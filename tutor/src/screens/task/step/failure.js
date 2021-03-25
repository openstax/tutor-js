import {
    React, PropTypes, styled,
} from 'vendor';
import { StepCard } from './card';
import { get } from 'lodash';
import { titleize } from '../../../helpers/object';
import Raven from '../../../models/app/raven';
import Task from '../../../models/student-tasks/task';
import SupportEmailLink from '../../../components/support-email-link';
import ReloadPageButton from '../../../components/buttons/reload-page';

const StyledFailure = styled(StepCard)`
  p { line-height: 1.5rem; }
  h4 { margin: 2rem 0; }
  button.reload-page { margin: auto; }
`;


class Failure extends React.Component {

    static propTypes = {
        task: PropTypes.instanceOf(Task).isRequired,
        step: PropTypes.object,
    }

    componentDidMount() {
        const { task, step } = this.props;

        let errMsg = [];
        if (get(task, 'api.hasErrors')) {
            const { last: _, ...errors } = task.api.errors;
            errMsg.push(`Failed to load assignment, errors: ${titleize(errors)}`);
        }
        // step may not be present if the task had errors
        if (!step) { return; }

        const { last: _, ...errors } = get(step, 'api.errors', {});
        errMsg.push(`Failed to ${this.isLoading ? 'load' : 'save'} assignment step, errors: ${titleize(errors)}`);
        if (errMsg.length) {
            Raven.log(errMsg.join('\n'), {
                taskId: task.id,
                stepId: step.id,
            });
        }
    }

    get isLoading() {
        const model = this.props.step || this.props.task;
        return 'get' === get(model, 'api.errors.last.config.method');
    }

    render() {
        return (
            <StyledFailure>
                <h3>
          We’re sorry! An error occurred
          when {this.isLoading ? 'loading' : 'saving'} this step.
                </h3>
                <h4>
          Please either go back and retry or
          reload this page and try again.
                </h4>
                <p>
          We’ve received an automated notification
          that this error occurred and we’ll look into it.
                </p>
                <p>
          Please <SupportEmailLink label="contact support" /> if
          you continue to get this error.
                </p>
                <ReloadPageButton />
            </StyledFailure>
        );
    }

}


export default Failure;
