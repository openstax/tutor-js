import {
  React, PropTypes, idType, styled,
} from '../../../helpers/react';
import { StepCard } from './card';
import { titleize } from '../../../helpers/object';
import Raven from '../../../models/app/raven';
import SupportEmailLink from '../../../components/support-email-link';
import ReloadPageButton from '../../../components/buttons/reload-page';

const StyledFailure = styled(StepCard)`
  p { line-height: 1.5rem; }
  h4 { margin: 2rem 0; }
  button.reload-page { margin: auto; }
`;


class Failure extends React.Component {

  static propTypes = {
    task: PropTypes.shape({
      id: idType,
    }),
    step: PropTypes.shape({
      id: idType,
    }),
  }

  componentDidMount() {
    const { task } = this.props;
    if (!task) {
      return Raven.log('Failed to load assignment task');
    }
    if (task.api.hasErrors) {
      return Raven.log(`Failed to load assignment, errors: ${titleize(task.api.errors)}`);
    }

    const { step } = this.props;
    if (!step) {
      return Raven.log('Failed to load assignment step');
    }
    Raven.log(`Failed to load assignment step id: ${step.id}, error: ${titleize(step.api.errors)}`);
    return null;
  }

  render() {
    return (
      <StyledFailure>
        <h3>
          We’re sorry! An error occurred when loading this step.
        </h3>
        <h4>
          Please reload this page and try again.
        </h4>
        <p>
          We’ve received an automated notification that this error occurred and we’ll look into it.
        </p>
        <p>
          Please <SupportEmailLink label="contact support" /> if you continue to get this error.
        </p>
        <ReloadPageButton />
      </StyledFailure>
    );
  }

}


export default Failure;
